const db = require('../../../lib/db')

const people = {
  get: async (name, version) => {
    if (typeof name !== 'string') throw new Error('[people] name should be a string')
    if (name.length > 128) throw new Error('[people] name should be less than 128 chars')
    if (typeof version !== 'string') throw new Error('[people] version should be a string')
    if (version.length > 64) throw new Error('[people] version should be less than 64 chars')

    try {
      const result = await db.query(`SELECT * FROM people WHERE name=$1 AND version=$2`, [name, version])
      return result
    } catch (err) {
      throw err
    }
  },

  insert: async (name, version, email, fullname, url, type) => {
    if (typeof name !== 'string') throw new Error('[people] name should be a string')
    if (name.length > 128) throw new Error('[people] name should be less than 128 chars')
    if (typeof version !== 'string') throw new Error('[people] version should be a string')
    if (version.length > 128) throw new Error('[people] version should be less than 128 chars')
    if (typeof email !== 'string') throw new Error('[people] email should be a string')
    if (email.length > 64) throw new Error('[people] email should be less than 64 chars')
    if (typeof fullname !== 'string') throw new Error('[people] fullname should be a string')
    if (fullname.length > 64) throw new Error('[people] fullname should be less than 64 chars')
    if (typeof url !== 'string') throw new Error('[people] url should be a string')
    if (url.length > 64) throw new Error('[people] url should be less than 64 chars')
    if (typeof type !== 'string') throw new Error('[people] type should be a string')
    if (type.length > 16) throw new Error('[people] type should be less than 16 chars')
    const typeAllowed = ['author', 'maintainers', 'contributors']
    if (!typeAllowed.includes(type)) throw new Error('[people] type should be in author/maintainers/contributors')

    try {
      const result = await db.query(`INSERT INTO people(name, version, email, fullname, url, type) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`, [name, version, email, fullname, url, type])
      return result
    } catch(err) {
      throw err
    }
  }
}

module.exports = people