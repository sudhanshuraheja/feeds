const joi = require('joi')

require('dotenv').config()

const config = {
  port: process.env.PORT,
  logLevel: process.env.LOGLEVEL
}

const schema = {
  port: joi.number().min(3000).max(6000).required(),
  logLevel: joi.string().valid('info', 'debug').required()
}

joi.validate(config, schema, (err, value) => {
  if (err != null) {
    console.log(err.details[0].message)
    process.exit(1)
  }
})

module.exports = config