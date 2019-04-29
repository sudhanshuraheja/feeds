const db = require('../../../lib/db')

const keywords = {
  get: async (name, version) => {
    if (typeof name !== 'string') throw new Error('[keywords] name should be a string')
    if (name.length > 128) throw new Error('[keywords] name should be less than 128 chars')
    if (typeof version !== 'string') throw new Error('[keywords] version should be a string')
    if (version.length > 64) throw new Error('[keywords] version should be less than 64 chars')

    try {
      const result = await db.query(`SELECT * FROM keywords WHERE name=$1 AND version=$2`, [name, version])
      return result
    } catch (err) {
      throw err
    }
  },

  insert: async (name, version, keyword) => {
    if (typeof name !== 'string') throw new Error('[keywords] name should be a string')
    if (name.length > 128) throw new Error('[keywords] name should be less than 128 chars')
    if (typeof version !== 'string') throw new Error('[keywords] version should be a string')
    if (version.length > 64) throw new Error('[keywords] version should be less than 64 chars')
    if (typeof keyword !== 'string') throw new Error('[keywords] keyword should be a string')
    if (keyword.length > 64) throw new Error('[keywords] keyword should be less than 64 chars')

    try {
      const result = await db.query(`INSERT INTO keywords(name, version, keyword) VALUES($1, $2, $3) RETURNING *`, [name, version, keyword])
      return result
    } catch(err) {
      throw err
    }
  }
}

module.exports = keywords