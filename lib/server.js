const compression = require('compression')
const morgan = require('morgan')
const config = require('./config')
const logger = require('./config/logger')('lib/server')
const db = require('./db')

const express = require('express')
const app = express()

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
app.get('/health', (req, res, next) => res.json({ status: 'UP' }))
app.get('/healthcheck', (req, res, next) => {
  res.status(200).json({
    message: 'OK',
    timestamp: Date.now(),
  })
})

// 404s
app.use((req, res, next) => res.status(404).json({ error: "This endpoint does not exist" }))

// Start the server
const server = app.listen(
  config.port, 
  (err) => {
    if(err) {
      logger.error('Unable to bind to network socket')
      process.exit(10)
    } else {
      logger.info(`Listening on port ${config.port}`)
    }
  }
)

// Connect to the database
db.connect((err) => {
  process.emit('cleanup')
})

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
  if(!server) {
    process.exit(0)
  }

  db
    .end()
    .then(() => {
      server.close(() => {
        logger.error('Closing server connections gracefully')
        process.exit(0)
      })    
    })
    
})

module.exports = app