const { Pool } = require('pg')
const config = require('../config')
const logger = require('../config/logger')('lib/db')
const errors = require('../errors')

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
    try {
      client = await pool.connect()
      client.release()
      db.status()
    } catch(err) {
      throw(new errors.PostgresError(err))
    }
  },
  
  query: async (text, params) => {
    try {
      const start = Date.now()
      result = await pool.query(text, params)
      const duration = Date.now() - start
      logger.debug(`Executed Query: ${text}, duration: ${duration}, rows: ${result.rows.length}`)
      db.status()
      return result  
    } catch(err) {
      logger.error(`Query Failed: ${text}`)
      throw(new errors.PostgresError(err))
    }
  },

  status: () => {
    logger.debug('Pool total:' + pool.totalCount + ', idle:' + pool.idleCount + ', waiting:' + pool.waitingCount)
  },

  getClient: async () => {
    try {
      client = await pool.connect()
      db.status()
      return client  
    } catch(err) {
      throw(new errors.PostgresError(err))
    }
  },

  end: async () => {
    try {
      await pool.end()
      logger.debug('Completed postgres shutdown')  
    } catch(err) {
      throw(new errors.PostgresError(err))
    }
  },

  tableExists: async (table, callback) => {
    try {
      const result = await db.query(`SELECT to_regclass('${table}');`, [])
      if (result.rows[0].is_regclass) {
        return false
      }
      return true  
    } catch(err) {
      throw(new errors.PostgresError(err))
    }
  }
  
}

module.exports = db