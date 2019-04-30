const joi = require('joi')
const db = require('../../../lib/db')
const log = require('../../../lib/logger')

const logger = log.init('npm/repo/dependencies')

const dependencies = {
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
      const result = await db.query(`SELECT * FROM dependencies WHERE name=$1 AND version=$2`, [name, version])
      return result
    } catch (err) {
      throw err
    }
  },

  insert: async (name, version, dependency, semver, url, type) => {
    const schema = joi.object().keys({
      name: joi.string().max(128).required(),
      version: joi.string().max(64).required(),
      dependency: joi.string().max(128).required(),
      semver: joi.string().max(256).allow('').optional(),
      url: joi.string().max(128).allow('').optional(),
      type: joi.string().max(128).valid('dep', 'bundle', 'dev', 'optional')
    })

    const validation = joi.validate({ name, version, dependency, semver, url, type }, schema)
    if (validation.error) {
      logger.debug(`Dependencies: ${name}, ${version}, ${dependency}, ${semver}, ${url}, ${type}`)
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