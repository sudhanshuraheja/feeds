const joi = require('joi')
const db = require('../../../lib/db')
const log = require('../../../lib/logger')

const logger = log.init('repo/npm/tags')

const tags = {
  get: async (name, tag) => {
    const schema = joi.object().keys({
      name: joi.string().required(),
      tag: joi.string().required(),
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
      name: joi.string().required(),
      tag: joi.string().required(),
      version: joi.string().required(),
    })

    const validation = joi.validate({ name, tag, version }, schema)
    if (validation.error) {
      logger.debug(`Tags: ${validation.error.details[0].context.key} :: ${validation.error.details[0].context.value}`)
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