const joi = require('joi')
const db = require('../../../lib/db')

const people = {
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
      const result = await db.query(`SELECT * FROM people WHERE name=$1 AND version=$2`, [name, version])
      return result
    } catch (err) {
      throw err
    }
  },

  insert: async (name, version, email, fullname, url, type) => {
    const schema = joi.object().keys({
      name: joi.string().max(128).required(),
      version: joi.string().max(128).required(),
      email: joi.string().max(64).required(),
      fullname: joi.string().max(64).required(),
      url: joi.string().max(64).required(),
      type: joi.string().max(16).valid('author', 'maintainers', 'contributors')
    })

    const validation = joi.validate({ name, version, email, fullname, url, type }, schema)
    if (validation.error) {
      throw new Error(validation.error.details[0].message)
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