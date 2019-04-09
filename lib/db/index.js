const { Pool } = require('pg')
const logger = require('../config/logger')('lib/db')

const pool = new Pool({
  host: 'localhost',
  user: 'database-user',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
})

pool.on('error', (err, client) => {
  logger.error('Uncaught error', err)
})

const db = {
  
  query: (text, params, callback) => {
    const start = Date.now()
    db.status()
    return pool.query(text, params, (err, result) => {
      const duration = Date.now() - start
      db.status()
      logger.debug('Executed query', { text, duration, rows: res.rowCount })
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