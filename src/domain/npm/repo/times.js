const joi = require('joi')
const db = require('../../../lib/db')
const log = require('../../../lib/logger')

const logger = log.init('repo/npm/times')

const times = {
  get: async (name, version) => {
    const schema = joi.object().keys({
      name: joi.string().required(),
      version: joi.string().required(),
    })

    const validation = joi.validate({ name, version }, schema)
    if (validation.error) {
      throw new Error(validation.error.details[0].message)
    }

    try {
      const result = await db.query(`SELECT * FROM times WHERE name=$1 AND version=$2`, [name, version])
      return result
    } catch (err) {
      throw err
    }
  },

  insert: async (name, version, time) => {
    const schema = joi.object().keys({
      name: joi.string().required(),
      version: joi.string().required(),
      time: joi.date().iso().required(),
    })

    const validation = joi.validate({ name, version, time }, schema)
    if (validation.error) {
      logger.debug(`Times: ${validation.error.details[0].context.key} :: ${validation.error.details[0].context.value}`)
      throw new Error(`Times: ${validation.error.details[0].message}`)
    }

    try {
      const result = await db.query(`INSERT INTO times(name, version, time) VALUES($1, $2, $3) RETURNING *`, [name, version, time])
      return result
    } catch(err) {
      throw err
    }
  }
}

module.exports = times