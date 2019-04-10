const fs = require('fs')
const config = require('../config')
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

  up: async () => {
    logger.info("Trying up")
    await migrate.connect()
    migrate
      .readMigrationSqlFolder()
      .then(async (files) => {
        const f = files.filter( file => file.match('.up.sql')).sort()
        console.log(f)

        await db.query(`CREATES TABLE IF NOT EXISTS migrations (
          last varchar(512) NOT NULL,
          migrated bigint NOT NULL
        )`, [])
      })
      .catch((err) => {
        if (err instanceof errors.PostgresError) {
          logger.error(err)
        } else if (err instanceof errors.FileError) {
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
        }
        resolve(files)
      })
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