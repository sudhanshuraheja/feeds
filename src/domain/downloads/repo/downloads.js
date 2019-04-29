const joi = require('joi')
const db = require('../../../lib/db')

const downloads = {
  get: async (uuid) => {
    const schema = joi.object().keys({
      uuid: joi.string().guid({ version: ['uuidv4'] }).required(),
    })

    const validation = joi.validate({ uuid }, schema)
    if (validation.error) {
      throw new Error(validation.error.details[0].message)
    }

    try {
      const result = await db.query(`SELECT * FROM downloads WHERE uuid=$1`, [uuid])
      return result
    } catch (err) {
      throw err
    }
  },

  insert: async (name, startTime, endTime, downloadCount) => {
    const schema = joi.object().keys({
      name: joi.string().max(128).required(),
      startTime: joi.date().iso().required(),
      endTime: joi.date().iso().required(),
      downloadCount: joi.number().min(0).required(),
    })

    const validation = joi.validate({ name, startTime, endTime, downloadCount }, schema)
    if (validation.error) {
      throw new Error(validation.error.details[0].message)
    }

    try {
      const result = await db.query(`INSERT INTO downloads(name, startTime, endTime, downloads) VALUES($1, $2, $3, $4) RETURNING *`, [name, startTime, endTime, downloadCount])
      return result
    } catch(err) {
      throw err
    }
  }
}

module.exports = downloads