const joi = require('joi')
const db = require('../../../lib/db')
const log = require('../../../lib/logger')

const logger = log.init('repo/npm/tags')

const tags = {
  get: async (name, tag) => {
    const schema = joi.object().keys({
      name: joi.string().max(128).required(),
      tag: joi.string().max(64).required(),
    })

    const validation = joi.validate({ name, tag }, schema)
    if (validation.error) {
      throw new Error(validation.error.details[0].message)
    }

    try {
      const result = await db.query(`SELECT * FROM tags WHERE name=$1 AND tag=$2`, [name, tag])
      return result
    } catch (err) {
      throw err
    }
  },

  insert: async (name, tag, version) => {
    const schema = joi.object().keys({
      name: joi.string().max(128).required(),
      tag: joi.string().max(64).required(),
      version: joi.string().max(64).required(),
    })

    const validation = joi.validate({ name, tag, version }, schema)
    if (validation.error) {
      logger.error(`Tags: ${name}, ${tag}, ${version}`)
      throw new Error(`Tags: ${validation.error.details[0].message}`)
    }

    try {
      const result = await db.query(`INSERT INTO tags(name, tag, version) VALUES($1, $2, $3) RETURNING *`, [name, tag, version])
      return result
    } catch(err) {
      throw err
    }
  }
}

module.exports = tags