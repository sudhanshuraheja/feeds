const db = require('../../../lib/db')

const times = {
  get: async (name, version) => {
    if (typeof name !== 'string') throw new Error('[times] name should be a string')
    if (name.length > 128) throw new Error('[times] name should be less than 128 chars')
    if (typeof version !== 'string') throw new Error('[times] version should be a string')
    if (version.length > 64) throw new Error('[times] version should be less than 64 chars')

    try {
      const result = await db.query(`SELECT * FROM times WHERE name=$1 AND version=$2`, [name, version])
      return result
    } catch (err) {
      throw err
    }
  },

  insert: async (name, version, time) => {
    if (typeof name !== 'string') throw new Error('[times] name should be a string')
    if (name.length > 128) throw new Error('[times] name should be less than 128 chars')
    if (typeof version !== 'string') throw new Error('[times] version should be a string')
    if (version.length > 64) throw new Error('[times] version should be less than 64 chars')
    if (typeof time !== 'string') throw new Error('[times] time should be a string')

    try {
      const result = await db.query(`INSERT INTO times(name, version, time) VALUES($1, $2, $3) RETURNING *`, [name, version, time])
      return result
    } catch(err) {
      throw err
    }
  }
}

module.exports = times