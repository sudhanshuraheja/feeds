const { Pool } = require('pg')
const config = require('../config')
const logger = require('../config/logger')('lib/db')
const errors = require('../errors/')

let pool

const db = {

  connect: async () => {
    try {
      pool = new Pool({
        host: config.env.PG_HOST,
        port: config.env.PG_PORT,
        user: config.env.PG_USER,
        password: config.env.PG_PASS,
        database: config.env.PG_DATABASE,
        max: config.env.PG_MAX_CONNECTIONS,
        idleTimeoutMillis: config.env.PG_IDLE_TIMEOUT_MS,
        connectionTimeoutMillis: config.env.PG_CONNECTION_TIMEOUT_MS
      })

      pool.on('error', (err, client) => {
        logger.error('Uncaught error', err)
        client.release()
      })      
            
      const client = await pool.connect()
      client.release()

    } catch(err) {
      throw(new errors.PostgresClientError(err))
    }
  },
  
  query: async (text, params) => {
    try {
      const start = Date.now()
      const result = await pool.query(text, params)
      const duration = Date.now() - start
      logger.debug(`Executed Query: ${text}, duration: ${duration}ms, rows: ${result.rows.length}, pool total:${pool.totalCount}, idle:${pool.idleCount}, waiting:${pool.waitingCount}`)
      return result  
    } catch(err) {
      logger.error(`Query Failed: ${text}, pool total:${pool.totalCount}, idle:${pool.idleCount}, waiting:${pool.waitingCount}`)
      throw(new errors.PostgresQueryError(err))
    }
  },

  status: () => {
    logger.debug(`Pool total:${pool.totalCount}, idle:${pool.idleCount}, waiting:${pool.waitingCount}`)
  },

  getClient: async () => {
    try {
      return await pool.connect()
    } catch(err) {
      throw(new errors.PostgresClientError(err))
    }
  },

  end: async () => {
    try {
      await pool.end()
      logger.debug('Completed postgres shutdown')  
    } catch(err) {
      throw(new errors.PostgresClientError(err))
    }
  },

  tableExists: async (table) => {
    try {
      const result = await db.query(`SELECT to_regclass('${table}');`, [])
      if (result.rows[0].to_regclass === table) {
        return true
      }
      return false
    } catch(err) {
      throw(new errors.PostgresQueryError(err))
    }
  }
  
}

module.exports = db