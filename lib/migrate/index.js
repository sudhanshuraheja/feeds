const config = require('../config')
const logger = require('../config/logger')('db/migrate')
const db = require('../db')

const migrate = {
  connect: async () => {
    await db.connect((err) => {
      process.emit('cleanup')
    })
  },

  up: () => {
    logger.info("Trying up")
  },

  down: () => {
    logger.info("Trying down")
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