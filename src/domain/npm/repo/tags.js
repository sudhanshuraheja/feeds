const db = require('../../../lib/db')

const tags = {
  get: async (name, tag) => {
    if (typeof name !== 'string') throw new Error('[tags] name should be a string')
    if (name.length > 128) throw new Error('[tags] name should be less than 128 chars')
    if (typeof tag !== 'string') throw new Error('[tags] tag should be a string')
    if (tag.length > 64) throw new Error('[tags] tag should be less than 64 chars')

    try {
      const result = await db.query(`SELECT * FROM tags WHERE name=$1 AND tag=$2`, [name, tag])
      return result
    } catch (err) {
      throw err
    }
  },

  insert: async (name, tag, version) => {
    if (typeof name !== 'string') throw new Error('[tags] name should be a string')
    if (name.length > 128) throw new Error('[tags] name should be less than 128 chars')
    if (typeof tag !== 'string') throw new Error('[tags] tag should be a string')
    if (tag.length > 64) throw new Error('[tags] tag should be less than 64 chars')
    if (typeof version !== 'string') throw new Error('[tags] version should be a string')
    if (version.length > 64) throw new Error('[tags] version should be less than 64 chars')

    try {
      const result = await db.query(`INSERT INTO tags(name, tag, version) VALUES($1, $2, $3) RETURNING *`, [name, tag, version])
      return result
    } catch(err) {
      throw err
    }
  }
}

module.exports = tags