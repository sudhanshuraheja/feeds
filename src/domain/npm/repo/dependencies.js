const joi = require('joi')
const db = require('../../../lib/db')
const log = require('../../../lib/logger')

const logger = log.init('npm/repo/dependencies')

const dependencies = {
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
      const result = await db.query(`SELECT * FROM dependencies WHERE name=$1 AND version=$2`, [name, version])
      return result
    } catch (err) {
      throw err
    }
  },

  insert: async (name, version, dependency, semver, url, type) => {
    const schema = joi.object().keys({
      name: joi.string().required(),
      version: joi.string().required(),
      dependency: joi.string().required(),
      semver: joi.string().allow('').optional(),
      url: joi.string().allow('').optional(),
      type: joi.string().valid('dep', 'bundle', 'dev', 'optional')
    })

    const validation = joi.validate({ name, version, dependency, semver, url, type }, schema)
    if (validation.error) {
      logger.debug(`Dependencies: ${validation.error.details[0].context.key} :: ${validation.error.details[0].context.value}`)
      throw new Error(`Dependencies: ${validation.error.details[0].message}`)
    }

    try {
      const result = await db.query(`INSERT INTO dependencies(name, version, dependency, semver, url, type) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`, [name, version, dependency, semver, url, type])
      return result
    } catch(err) {
      throw err
    }
  }
}

module.exports = dependencies