const compression = require('compression')
const morgan = require('morgan')
const config = require('./config/config')
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

app.listen(process.env.PORT, () => logger.info(`Listening on port ${process.env.PORT}`))

module.exports = app