const { Pool } = require('pg')
const config = require('../config')
const logger = require('../config/logger')('lib/db')

const pool = new Pool({
  host: config.pg_host,
  port: config.pg_port,
  user: config.pg_user,
  password: config.pg_password,
  database: config.pg_database,
  max: config.pg_max_connections,
  idleTimeoutMillis: config.pg_idle_timeout_ms,
  connectionTimeoutMillis: config.pg_connection_timeout_ms
})

pool.on('error', (err, client) => {
  logger.error('Uncaught error', err)
})

const db = {

  connect: async (callback) => {
    await pool.connect((err, client, release) => {
      if (err) {
        logger.error(err)
        callback(err)
      } else {
        release()
      }
    })
  },
  
  query: (text, params, callback) => {
    const start = Date.now()
    return pool.query(text, params, (err, result) => {
      const duration = Date.now() - start
      logger.debug(`Executed Query: ${text}, duration: ${duration}`)
      callback(err, result)
    })
  },

  status: () => {
    logger.debug('Pool total:' + pool.totalCount + ', idle:' + pool.idleCount + ', waiting:' + pool.waitingCount)
  },

  getClient: () => {
    pool.connect((err, client, done) => {
      db.status()
      callback(err, client, done)
    })
  },

  end: async () => {
    await pool.end()
    logger.debug('Completed postgres shutdown')
  }
  
}

db.status()

module.exports = db