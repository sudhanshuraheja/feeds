const joi = require('joi')

require('dotenv').config()

const config = {
  PORT: process.env.PORT,
  LOG_LEVEL: process.env.LOG_LEVEL,
  PG_HOST: process.env.PG_HOST,
  PG_PORT: process.env.PG_PORT,
  PG_USER: process.env.PG_USER,
  PG_PASS: process.env.PG_PASS,
  PG_DATABASE: process.env.PG_DATABASE,
  PG_MAX_CONNECTIONS: process.env.PG_MAX_CONNECTIONS,
  PG_IDLE_TIMEOUT_MS: process.env.PG_IDLE_TIMEOUT_MS,
  PG_CONNECTION_TIMEOUT_MS: process.env.PG_CONNECTION_TIMEOUT_MS
}

const schema = {
  PORT: joi.number().min(3000).max(6000).required(),
  LOG_LEVEL: joi.string().valid('info', 'debug').required(),
  PG_HOST: joi.string().required(),
  PG_PORT: joi.number().required().min(1000).max(10000).required(),
  PG_USER: joi.string().required(),
  PG_PASS: joi.string().allow('').required(),
  PG_DATABASE: joi.string().required(),
  PG_MAX_CONNECTIONS: joi.number().min(1).max(50).required(),
  PG_IDLE_TIMEOUT_MS: joi.number().min(100).max(5000000).required(),
  PG_CONNECTION_TIMEOUT_MS: joi.number().min(100).max(5000000).required()
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