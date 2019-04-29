const db = require('../../../lib/db')

const packages = {
  get: async (name) => {
    if (typeof name !== 'string') throw new Error('[packages] name should be a string')
    if (name.length > 128) throw new Error('[packages] name should be less than 128 chars')

    try {
      const result = await db.query(`SELECT * FROM packages WHERE name=$1`, [name])
      return result
    } catch (err) {
      throw err
    }
  },

  insert: async (name, rev, description, readme, timeModified, timeCreated, repositoryType, repositoryURL, repositoryGithubOrg, repositoryGithubRepo, readmeFileName, homepage, bugsURL, bugsEmail, licenceType, licenseURL, users) => {
    if (typeof name !== 'string') throw new Error('[packages] name should be a string')
    if (name.length > 128) throw new Error('[packages] name should be less than 128 chars')
    if (typeof rev !== 'string') throw new Error('[packages] rev should be a string')
    if (rev.length > 128) throw new Error('[packages] rev should be less than 128 chars')

    try {
      const result = await db.query(`INSERT INTO packages(name, rev, description, readme, timeModified, timeCreated, repositoryType, repositoryURL, repositoryGithubOrg, repositoryGithubRepo, readmeFileName, homepage, bugsURL, bugsEmail, licenceType, licenseURL, users) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING *`, [name, rev, description, readme, timeModified, timeCreated, repositoryType, repositoryURL, repositoryGithubOrg, repositoryGithubRepo, readmeFileName, homepage, bugsURL, bugsEmail, licenceType, licenseURL, users])
      return result
    } catch(err) {
      throw err
    }
  }
}

module.exports = packages