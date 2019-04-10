const { Pool } = require('pg')
const config = require('../config')
const logger = require('../config/logger')('lib/db')
const errors = require('../errors')
const async = require('async')

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
    } catch(err) {
      throw(new errors.PostgresClientError(err))
    }
  },
  
  query: async (text, params) => {
    try {
      const start = Date.now()
      result = await pool.query(text, params)
      const duration = Date.now() - start
      logger.debug(`Executed Query: ${text}, duration: ${duration}ms, rows: ${result.rows.length}, pool total:${pool.totalCount}, idle:${pool.idleCount}, waiting:${pool.waitingCount}`)
      return result  
    } catch(err) {
      logger.error(`Query Failed: ${text}, pool total:${pool.totalCount}, idle:${pool.idleCount}, waiting:${pool.waitingCount}`)
      throw(new errors.PostgresQueryError(err))
    }
  },

  transaction: async (queries) => {
    let client

    finalQueries = []
    finalQueries.push({ statement: 'BEGIN', params: [] })
    for(let q = 0; q < queries.length; q++) {
      finalQueries.push({ statement: queries[q].statement, params: queries[q].params })
    }
    finalQueries.push({ statement: 'COMMIT', params: [] })

    const start = Date.now()
    let duration = Date.now() - start
    client = await db.getClient()

    let failure = false
    let success = 0

    async.eachSeries(finalQueries, async query => {
      try {

        if (!failure) {
          await client.query(query.statement, query.params)
          duration = Date.now() - start
          logger.debug(`Executed Query: ${query.statement}, duration: ${duration}ms, rows: ${result.rows.length}, pool total:${pool.totalCount}, idle:${pool.idleCount}, waiting:${pool.waitingCount}`)
          success++
          
          if(success === finalQueries.length) {
            if (client) {
              client.release()  
            }
          }
        }

      } catch(errAsync) {

        failure = true
        logger.error(`Query Failed: ${errAsync}, pool total:${pool.totalCount}, idle:${pool.idleCount}, waiting:${pool.waitingCount}`)

        try {
          await client.query('ROLLBACK')
          logger.debug(`Executed Query: ROLLBACK, duration: ${duration}ms, rows: ${result.rows.length}, pool total:${pool.totalCount}, idle:${pool.idleCount}, waiting:${pool.waitingCount}`)            
        } catch(errRollback) {
          logger.error(`Query Failed: ${errRollback}, pool total:${pool.totalCount}, idle:${pool.idleCount}, waiting:${pool.waitingCount}`)
        }
        
        if (client) {
          client.release()
        }
  
      }

    })
  },

  status: () => {
    logger.debug(`Pool total:${pool.totalCount}, idle:${pool.idleCount}, waiting:${pool.waitingCount}`)
  },

  getClient: async () => {
    try {
      client = await pool.connect()
      return client  
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

  tableExists: async (table, callback) => {
    try {
      const result = await db.query(`SELECT to_regclass('${table}');`, [])
      if (result.rows[0].is_regclass) {
        return false
      }
      return true  
    } catch(err) {
      throw(new errors.PostgresQueryError(err))
    }
  }
  
}

module.exports = db