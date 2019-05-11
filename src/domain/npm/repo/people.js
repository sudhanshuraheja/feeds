const joi = require('joi')
const db = require('../../../lib/db')
const log = require('../../../lib/logger')

const logger = log.init('repo/npm/people')

const people = {
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
      const result = await db.query(`SELECT * FROM people WHERE name=$1 AND version=$2`, [name, version])
      return result
    } catch (err) {
      throw err
    }
  },

  insert: async (name, version, email, fullname, url, type) => {
    const schema = joi.object().keys({
      name: joi.string().required(),
      version: joi.string().required(),
      email: joi.string().allow('').optional(),
      fullname: joi.string().allow('').required(),
      url: joi.string().allow('').optional(),
      type: joi.string().valid('author', 'maintainer', 'contributor')
    })

    const validation = joi.validate({ name, version, email, fullname, url, type }, schema)
    if (validation.error) {
      logger.debug(`People: ${validation.error.details[0].context.key} :: ${validation.error.details[0].context.value}`)
      throw new Error(`People: ${validation.error.details[0].message}`)
    }

    try {
      const result = await db.query(`INSERT INTO people(name, version, email, fullname, url, type) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`, [name, version, email, fullname, url, type])
      return result
    } catch(err) {
      throw err
    }
  }
}

module.exports = people