const logger = require('../config/logger')('lib/migrate')
const errors = require('../errors')
const disk = require('../disk')
const store = require('./store')
const config = require('../config')

const sqlFolder = './lib/migrate/sql/'

const migrate = {

  connect: async () => {
    function handle(signal) {
      migrate.release(signal)
    }
    process.on('SIGINT', handle)
    process.on('SIGTERM', handle)
    process.on('uncaughtException', handle)
    process.on('cleanup', handle)

    try {
      await store.init()
    } catch(err) {
      process.emit('cleanup')
    }
  },

  init: async (direction) => {
    config.init()
    logger.info(`Trying ${direction}`)
    await migrate.connect()
    try {
      const files = await migrate.readFolder(direction)
      const step = await migrate.getStep()
      if (!step) {
        // Adding data for the first time
        await migrate.processFile(`${sqlFolder}${files[0]}`, files[0].split('_')[0], false)
      } else {
        // There's existing data
        let next = false
        let toBeMigrated = false
        files.forEach(file => {
          if (next) {
            toBeMigrated = file
            next = false
          }
          if (file.split('_')[0] === step) {
            next = true
          }
        });

        if (toBeMigrated) {
          await migrate.processFile(`${sqlFolder}${toBeMigrated}`, toBeMigrated.split('_')[0], true)
        } else {
          logger.info('No files to be migrated')
          process.emit('cleanup')
        }
      }
    } catch(err) {
      logger.error(err)
      process.emit('cleanup')
    }
  },

  release: async (reason) => {
    logger.info(`Found ${reason}, cleaning up`)
    await store.release()
    process.exit(0)
  },

  getStep: async () => {
    await store.setup()
    const migrations = await store.get()

    if (migrations.rows.length === 0) {
      return null
    } 
    return migrations.rows[0].step
  },

  readFolder: async (direction) => {
    try {
      const files = await disk.readFolder()
      if ( !((direction === 'up') || (direction === 'down') || (direction === 'check')) ) {
        throw new errors.AppError('Valid values for the migrate command are up, down and check')
      }

      const f = files
        .filter( file => file.match(`.${direction}.sql`) )
        .sort((a, b) => {
          if (direction === 'up') {
            return a > b
          } if (direction === 'down') {
            return b > a
          }
          return a > b   
          }
        )

      // If there are no files, there are no migrations
      if (f.length === 0) {
        throw new errors.FileError('No files to process')
      }
      return files
    } catch(err) {
      throw new errors.FileError(err)
    }
  },

  processFile: async (path, step, update) => {
    try {
      const data = await disk.readFile(path)
      logger.debug(`Read file ${path} and found\n${data}\n`)
      await store.processSQL(data)
      await migrate.updateStep(step, update)
    } catch(err) {
      logger.error(err)
    }
    process.emit('cleanup')
  },

  updateStep: async (step, update) => {
    if (update) {
      await store.update(step)
    } else {
      await store.add(step)
    }
  }

}

module.exports = migrate