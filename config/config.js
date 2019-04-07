const joi = require('joi')

require('dotenv').config()

const configs = {
  port: process.env.PORT
}

const schema = {
  port: joi.number().min(3000).max(6000)
}

joi.validate(configs, schema, (err, value) => {
  if (err != null) {
    console.log(err.details[0].message)
    process.exit(1)
  }
})