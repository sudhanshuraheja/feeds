const joi = require('joi')
const db = require('../../../lib/db')
const log = require('../../../lib/logger')

const logger = log.init('repo/npm/sequence')

const sequence = {
  get: async (seq) => {
    const schema = joi.object().keys({
      seq: joi.number().min(1).required(),
    })

    const validation = joi.validate({ seq }, schema)
    if (validation.error) {
      throw new Error(validation.error.details[0].message)
    }

    try {
      const result = await db.query(`SELECT * FROM sequence WHERE seq=$1`, [seq])
      return result
    } catch (err) {
      throw err
    }
  },

  insert: async (seq, name, rev) => {
    const schema = joi.object().keys({
      seq: joi.number().min(1).required(),
      name: joi.string().max(256).required(),
      rev: joi.string().max(64).required(),
    })

    const validation = joi.validate({ seq, name, rev }, schema)
    if (validation.error) {
      logger.error(`Sequence: ${validation.error.details[0].context.key} :: ${validation.error.details[0].context.value}`)
      throw new Error(`Sequence: ${validation.error.details[0].message}`)
    }

    try {
      const result = await db.query(`INSERT INTO sequence(seq, name, rev) VALUES($1, $2, $3) RETURNING *`, [seq, name, rev])
      return result
    } catch(err) {
      throw err
    }
  }
}

module.exports = sequence