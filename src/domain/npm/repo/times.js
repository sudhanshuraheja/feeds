const joi = require('joi')
const db = require('../../../lib/db')

const times = {
  get: async (name, version) => {
    const schema = joi.object().keys({
      name: joi.string().max(128).required(),
      version: joi.string().max(64).required(),
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
      name: joi.string().max(128).required(),
      version: joi.string().max(64).required(),
      time: joi.date().iso().required(),
    })

    const validation = joi.validate({ name, version, time }, schema)
    if (validation.error) {
      throw new Error(validation.error.details[0].message)
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