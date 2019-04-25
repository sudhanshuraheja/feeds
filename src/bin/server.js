const compression = require('compression')
const morgan = require('morgan')
const express = require('express')
const config = require('../lib/config')
const logger = require('../lib/logger')('lib/server')
const db = require('../lib/db')

const app = express()

const server = {

  binary: null,

  init: async () => {
    config.init()
    
    function handle(signal) {
      server.release(signal)
    }
    process.on('SIGINT', handle)
    process.on('SIGTERM', handle)
    process.on('uncaughtException', handle)
    process.on('cleanup', handle)
        
    await server.initApp()
    await server.initDb()
  },

  release: async (reason) => {
    logger.info(`Found ${reason}, cleaning up`)
    await server.releaseApp()
    await server.releaseDb()
    if (config.env.IS_TEST === false) {
      process.exit(0)
    }
  },

  initApp: async () => {

    app.use(morgan('combined'))
    app.use(compression())
    app.disable('x-powered-by')

    app.use((req, res, next) => {
      res.header('X-Frame-Options', 'DENY')
      res.header('X-Content-Type-Options', 'nosniff')
      res.header('X-XSS-Protection', '1')
      next()
    })

    app.get('/', (req, res) => res.json({ data: "hello world" }))

    // Health Check
    app.get('/health', (req, res) => res.json({ status: 'UP' }))
    app.get('/healthcheck', (req, res) => {
      res.status(200).json({
        message: 'OK',
        timestamp: Date.now(),
      })
    })

    // 404s
    app.use((req, res) => res.status(404).json({ error: "This endpoint does not exist" }))

    try {
      server.binary = await app.listen(config.env.PORT)
      logger.info(`Listening on port ${config.env.PORT}`)
    } catch(err) {
      logger.error(err)
    }

  },

  releaseApp: async () => {
    try {
      if (server.binary) {
        await server.binary.close()
      }
      logger.info('Closed server connections gracefully')
    } catch(err) {
      logger.error(`Problem with closing server ${err}`)
    }
  },

  initDb: async () => {
    // Connect to the database
    try {
      await db.connect()
    } catch(err) {
      logger.error(err)
      process.emit('cleanup')
    }    
  },

  releaseDb: async () => {
    try {
      await db.end()
    } catch(err) {
      logger.error(err)
    }
  }

}

module.exports = server