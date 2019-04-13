const fs = require('fs')
const logger = require('../config/logger')('lib/migrate')
const db = require('../db')
const errors = require('../errors')

const sql = './lib/migrate/sql/'

const migrate = {
  connect: async () => {
    try {
      await db.connect()
    } catch(err) {
      logger.error(err)
      process.emit('cleanup')
    }
  },

  load: async (direction) => {
    logger.info(`Trying ${direction}`)
    await migrate.connect()
    migrate
      .readMigrationSqlFolder(direction)
      .then(async (files) => {
        const step = await migrate.getCurrentMigrationStep()
        if (!step) {
          // Adding data for the first time
          migrate.readAndExecuteSQLFile(`${sql}${files[0]}`, files[0].split('_')[0], false)
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
            migrate.readAndExecuteSQLFile(`${sql}${toBeMigrated}`, toBeMigrated.split('_')[0], true)
          } else {
            logger.info('No files to be migrated')
            process.emit('cleanup')
          }
          
        }
      })
      .catch((err) => {
        logger.error(err)
        process.emit('cleanup')
      })
  },

  check: () => {
    logger.info("Check if new migrations are available")
  },

  getCurrentMigrationStep: async () => {
    await db.query(`CREATE TABLE IF NOT EXISTS migrations (
      tag varchar(16) PRIMARY KEY,
      step varchar(512) NOT NULL,
      migrated bigint NOT NULL
    )`, [])

    const migrations = await db.query(`SELECT * FROM migrations`, [])
    if (migrations.rows.length === 0) {
      return null
    } 
    return migrations.rows[0].step
  },

  readMigrationSqlFolder: (direction) => {
    return new Promise((resolve, reject) => {
      fs.readdir(sql, (err, files) => {
        if (err) {
          reject(new errors.FileError(err))
        } else {

          if ( (direction !== 'up') || (direction !== 'down') || (direction !== 'check') ) {
            reject(new errors.AppError('Valid values for the migrate command are up, down and check'))
          }

          const f = files
                      .filter( file => file.match(`.${direction}.sql`) )
                      .sort((a, b) => {
                        if (direction === 'up') {
                          return a > b
                        } 
                        return b > a
                      })

          // If there are no files, there are no migrations
          if (f.length === 0) {
            reject(new errors.FileError('No files to process'))
          } else {
            resolve(f)
          }
        }
      })
    })
  },

  readFile: (path) => {
    return new Promise((resolve, reject) => {
      fs.readFile(path, 'utf8', (err, data) => {
        if (err) {
          reject(new errors.FileError(err))
        } else {
          resolve(data)
        }
      })
    })
  },

  readAndExecuteSQLFile: (path, step, update) => {
    migrate
      .readFile(path)
      .then(async (data) => {
        logger.debug(`Read file ${path} and found\n${data}\n`)
        const queries = []
        const params = []
        for (let i = 0; i < data.split(';').length; i += 1 ) {
          const query = data.split(';')[i].replace(/\n/g, '')
          if (query !== '') {
            queries.push({ statement: `${query};`, params })
          }
        }
        await db.transaction(queries)
        await migrate.updateStep(step, update)
        process.emit('cleanup')
      })
      .catch((err) => {
        logger.error(err)
        process.emit('cleanup')
      })
  },

  updateStep: async (step, update) => {
    if (update) {
      await db.query(`UPDATE migrations SET step=$1, migrated=$2 WHERE tag='latest'`, [step, Date.now()])
    } else {
      await db.query(`INSERT INTO migrations(tag, step, migrated) VALUES ('latest', $1, $2)`, [step, Date.now()])
    }
  }

}

// Handle failures gracefully
const cleanup = (callback) => {
  process.on('cleanup',callback)

  process.on('SIGINT', () => {
    logger.error('Received Control+C')
    process.emit('cleanup')
  })

  process.on('SIGTERM', () => {
    logger.error('Received SIGTERM')
    process.emit('cleanup')
  })

  process.on('uncaughtException', (e) => {
    logger.error(e.stack)
    process.emit('cleanup')
  })
}

cleanup(() => {
  db
    .end()
    .then(() => {
      process.exit(0)
    })
    
})

module.exports = migrate