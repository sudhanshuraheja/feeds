const db = require('../../../lib/db')

const dependencies = {
  get: async (name, version) => {
    if (typeof name !== 'string') throw new Error('[dependencies] name should be a string')
    if (name.length > 128) throw new Error('[dependencies] name should be less than 128 chars')
    if (typeof version !== 'string') throw new Error('[dependencies] version should be a string')
    if (version.length > 64) throw new Error('[dependencies] version should be less than 64 chars')

    try {
      const result = await db.query(`SELECT * FROM dependencies WHERE name=$1 AND version=$2`, [name, version])
      return result
    } catch (err) {
      throw err
    }
  },

  insert: async (name, version, dependency, semver, url, type) => {
    if (typeof name !== 'string') throw new Error('[dependencies] name should be a string')
    if (name.length > 128) throw new Error('[dependencies] name should be less than 128 chars')
    if (typeof version !== 'string') throw new Error('[dependencies] version should be a string')
    if (version.length > 64) throw new Error('[dependencies] version should be less than 64 chars')
    if (typeof dependency !== 'string') throw new Error('[dependencies] dependency should be a string')
    if (dependency.length > 128) throw new Error('[dependencies] dependency should be less than 64 chars')
    if (typeof semver !== 'string') throw new Error('[dependencies] semver should be a string')
    if (semver.length > 64) throw new Error('[dependencies] semver should be less than 64 chars')
    if (typeof url !== 'string') throw new Error('[dependencies] url should be a string')
    if (url.length > 128) throw new Error('[dependencies] url should be less than 64 chars')
    if (typeof type !== 'string') throw new Error('[dependencies] type should be a string')
    if (type.length > 128) throw new Error('[dependencies] type should be less than 64 chars')
    const typeAllowed = ['dep', 'bundle', 'dev', 'optional']
    if (!typeAllowed.includes(type)) throw new Error('[dependencies] type should be in dep/bundle/dev/optional')

    try {
      const result = await db.query(`INSERT INTO dependencies(name, version, dependency, semver, url, type) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`, [name, version, dependency, semver, url, type])
      return result
    } catch(err) {
      throw err
    }
  }
}

module.exports = dependencies