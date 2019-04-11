const joi = require('joi')

require('dotenv').config()

const config = {
  port: process.env.PORT,
  logLevel: process.env.LOGLEVEL,
  pg_host: process.env.PG_HOST,
  pg_port: process.env.PG_PORT,
  pg_user: process.env.PG_USER,
  pg_password: process.env.PG_PASS,
  pg_database: process.env.PG_DATABASE,
  pg_max_connections: process.env.PG_MAX_CONNECTIONS,
  pg_idle_timeout_ms: process.env.PG_IDLE_TIMEOUT_MS,
  pg_connection_timeout_ms: process.env.PG_CONNECTION_TIMEOUT_MS
}

const schema = {
  port: joi.number().min(3000).max(6000).required(),
  logLevel: joi.string().valid('info', 'debug').required(),
  pg_host: joi.string().required(),
  pg_port: joi.number().required().min(1000).max(10000).required(),
  pg_user: joi.string().required(),
  pg_password: joi.string().allow('').required(),
  pg_database: joi.string().required(),
  pg_max_connections: joi.number().min(1).max(50).required(),
  pg_idle_timeout_ms: joi.number().min(100).max(5000000).required(),
  pg_connection_timeout_ms: joi.number().min(100).max(5000000).required()
}

// eslint-disable-next-line no-unused-vars
joi.validate(config, schema, (err, value) => {
  if (err != null) {
    // eslint-disable-next-line no-console
    console.log(err.details[0].message)
    process.exit(1)
  }
})

module.exports = config