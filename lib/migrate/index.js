const fs = require('fs')
const config = require('../config')
const logger = require('../config/logger')('lib/migrate')
const db = require('../db')
const errors = require('../errors')
const async = require('async')

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

  up: async () => {
    logger.info("Trying up")
    await migrate.connect()
    migrate
      .readMigrationSqlFolder()
      .then(async (files) => {
        const f = files.filter( file => file.match('.up.sql')).sort()
        
        // If there are no files, there are no migrations
        if (f.length === 0) {
          logger.error(`There are no migrations to be done`)
          process.emit('cleanup')
          return
        }

        await db.query(`CREATE TABLE IF NOT EXISTS migrations (
          last varchar(512) NOT NULL,
          migrated bigint NOT NULL
        )`, [])

        let migrations = await db.query(`SELECT * FROM migrations`, [])
        if (migrations.rows.length == 0) {
          // Adding data for the first time
          migrate.readAndExecuteFile(`${sql}${f[0]}`, f[0].split('_')[0])
        } else {
          // There's existing data
          console.log(['existing data'])
        }
      })
      .catch((err) => {
        if (err instanceof errors.PostgresClientError) {
          logger.error(err)
          process.emit('cleanup')
        } else if (err instanceof errors.PostgresQueryError) {
          logger.error(err)
          process.emit('cleanup')
        } else if (err instanceof errors.FileError) {
          logger.error(err)
          process.emit('cleanup')  
        } else {
          logger.error(err)
          process.emit('cleanup')
        }
      })
  },

  down: () => {
    logger.info("Trying down")
    migrator.down()
  },

  check: () => {
    logger.info("Check if new migrations are available")
    migrator.check()
  },

  readMigrationSqlFolder: () => {
    return new Promise((resolve, reject) => {
      fs.readdir(sql, (err, files) => {
        if (err) {
          reject(new errors.FileError(err))
        } else {
          resolve(files)
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

  readAndExecuteFile: (path, step) => {
    migrate
      .readFile(path)
      .then(async (data) => {
        logger.debug(`Read file ${path} and found\n${data}\n`)
        let queries = []
        const params = []
        for (let i = 0; i < data.split(';').length; i++ ) {
          let query = data.split(';')[i].replace(/\n/g, '')
          if (query != '') {
            queries.push({ statement: `${query};`, params: params })
          }
        }
        await db.transaction(queries)
        process.emit('cleanup')
      })
      .catch((err) => {
        console.log(err)
        if (err instanceof errors.PostgresClientError) {
          logger.error(err)
          process.emit('cleanup')
        } else if (err instanceof errors.PostgresQueryError) {
          logger.error(err)
          process.emit('cleanup')
        } else if (err instanceof errors.FileError) {
          logger.error(err)
          process.emit('cleanup')  
        } else {
          logger.error(err)
          process.emit('cleanup')
        }
      })
  }

}

// Handle failures gracefully
const cleanup = (callback) => {
  callback = callback || (() => {})
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

cleanup((e) => {
  db
    .end()
    .then(() => {
      process.exit(0)
    })
    
})

module.exports = migrate