const joi = require('joi')
const db = require('../../../lib/db')

const github = {
  get: async (uuid) => {
    const schema = joi.object().keys({
      uuid: joi.string().guid({ version: ['uuidv4'] }).required(),
    })

    const validation = joi.validate({ uuid }, schema)
    if (validation.error) {
      throw new Error(validation.error.details[0].message)
    }

    try {
      const result = await db.query(`SELECT * FROM github WHERE uuid=$1`, [uuid])
      return result
    } catch (err) {
      throw err
    }
  },

  insert: async (name, avatarURL, description, createdAt, updatedAt, pushedAt, homepage, size, stars, subscribers, forks, openIssueCount, language, licence, archived, disabled) => {
    const schema = joi.object().keys({
      name: joi.string().max(128).required(),
      avatarURL: joi.string().max(128).required(),
      description: joi.string().max(512).required(),
      createdAt: joi.date().iso().required(),
      updatedAt: joi.date().iso().required(),
      pushedAt: joi.date().iso().required(),
      homepage: joi.string().max(128).required(),
      size: joi.number().min(0).required(),
      stars: joi.number().min(0).required(),
      subscribers: joi.number().min(0).required(),
      forks: joi.number().min(0).required(),
      openIssueCount: joi.number().min(0).required(),
      language: joi.string().max(32).required(),
      licence: joi.string().max(16).required(),
      archived: joi.bool().required(),
      disabled: joi.bool().required(),
    })

    const validation = joi.validate({ name, avatarURL, description, createdAt, updatedAt, pushedAt, homepage, size, stars, subscribers, forks, openIssueCount, language, licence, archived, disabled }, schema)
    if (validation.error) {
      throw new Error(validation.error.details[0].message)
    }

    try {
      const result = await db.query(`INSERT INTO github(name, avatarURL, description, createdAt, updatedAt, pushedAt, homepage, size, stars, subscribers, forks, openIssueCount, language, licence, archived, disabled) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *`, [name, avatarURL, description, createdAt, updatedAt, pushedAt, homepage, size, stars, subscribers, forks, openIssueCount, language, licence, archived, disabled])
      return result
    } catch(err) {
      throw err
    }
  }
}

module.exports = github