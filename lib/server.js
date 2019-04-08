const compression = require('compression')
const morgan = require('morgan')
const config = require('./config')
const logger = require('./config/logger')(module)

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
app.use((req, res, next) => res.status(404).json({ error: "This endpoint does not exist" }))

const server = app.listen(
  config.port, 
  () => logger.info(`Listening on port ${config.port}`)
)

const cleanup = (callback) => {
  callback = callback || (() => {})
  process.on('cleanup',callback)

  // process.on('exit', () => {
  //   process.emit('cleanup')
  // })

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
  server.close(() => {
    logger.error('Closing server connections gracefully')
    process.exit(0)
  })
})

module.exports = app