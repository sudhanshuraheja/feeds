const joi = require('joi')
const db = require('../../../lib/db')
const log = require('../../../lib/logger')

const logger = log.init('npm/repo/keywords')

const keywords = {
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
      const result = await db.query(`SELECT * FROM keywords WHERE name=$1 AND version=$2`, [name, version])
      return result
    } catch (err) {
      throw err
    }
  },

  insert: async (name, version, keyword) => {
    const schema = joi.object().keys({
      name: joi.string().max(128).required(),
      version: joi.string().max(64).required(),
      keyword: joi.string().max(256).required(),
    })

    const validation = joi.validate({ name, version, keyword }, schema)
    if (validation.error) {
      logger.error(`Keywords: ${name}, ${version}, ${keyword}`)
      throw new Error(`Keywords: ${validation.error.details[0].message}`)
    }

    try {
      const result = await db.query(`INSERT INTO keywords(name, version, keyword) VALUES($1, $2, $3) RETURNING *`, [name, version, keyword])
      return result
    } catch(err) {
      throw err
    }
  }
}

module.exports = keywords