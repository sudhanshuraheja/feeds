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
          tag varchar(16) PRIMARY KEY,
          step varchar(512) NOT NULL,
          migrated bigint NOT NULL
        )`, [])

        const migrations = await db.query(`SELECT * FROM migrations`, [])
        if (migrations.rows.length === 0) {
          // Adding data for the first time
          migrate.readAndExecuteFile(`${sql}${f[0]}`, f[0].split('_')[0], false)
        } else {
          // There's existing data
          let next = false
          let toBeMigrated = false
          f.forEach(file => {
            if (next) {
              toBeMigrated = file
              next = false
            }
            if (file.split('_')[0] === migrations.rows[0].step) {
              next = true
            }
          });

          if (toBeMigrated) {
            migrate.readAndExecuteFile(`${sql}${toBeMigrated}`, toBeMigrated.split('_')[0], true)
          } else {
            logger.info('No files to be migrated')
            process.emit('cleanup')
          }
          
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
  },

  check: () => {
    logger.info("Check if new migrations are available")
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

  readAndExecuteFile: (path, step, update) => {
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