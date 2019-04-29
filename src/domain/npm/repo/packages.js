const joi = require('joi')
const db = require('../../../lib/db')

const packages = {
  get: async (name) => {
    const schema = joi.object().keys({
      name: joi.string().max(128).required(),
    })

    const validation = joi.validate({ name }, schema)
    if (validation.error) {
      throw new Error(validation.error.details[0].message)
    }

    try {
      const result = await db.query(`SELECT * FROM packages WHERE name=$1`, [name])
      return result
    } catch (err) {
      throw err
    }
  },

  insert: async (name, rev, description, readme, timeModified, timeCreated, repositoryType, repositoryURL, repositoryGithubOrg, repositoryGithubRepo, readmeFileName, homepage, bugsURL, bugsEmail, licenceType, licenseURL, users) => {
    const schema = joi.object().keys({
      name: joi.string().max(128).required(),
      rev: joi.string().max(128).required(),
      description: joi.string().required(),
      readme: joi.string().required(),
      timeModified: joi.string().required(),
      timeCreated: joi.string().required(),
      repositoryType: joi.string().max(16).required(),
      repositoryURL: joi.string().max(256).required(),
      repositoryGithubOrg: joi.string().max(64).required(),
      repositoryGithubRepo: joi.string().max(64).required(),
      readmeFileName: joi.string().max(256).required(),
      homepage: joi.string().max(256).required(),
      bugsURL: joi.string().max(256).required(),
      bugsEmail: joi.string().max(128).required(),
      licenceType: joi.string().max(64).required(),
      licenseURL: joi.string().max(256).required(),
      users: joi.number().required(),
    })

    const validation = joi.validate({ name, rev, description, readme, timeModified, timeCreated, repositoryType, repositoryURL, repositoryGithubOrg, repositoryGithubRepo, readmeFileName, homepage, bugsURL, bugsEmail, licenceType, licenseURL, users }, schema)
    if (validation.error) {
      throw new Error(validation.error.details[0].message)
    }

    try {
      const result = await db.query(`INSERT INTO packages(name, rev, description, readme, timeModified, timeCreated, repositoryType, repositoryURL, repositoryGithubOrg, repositoryGithubRepo, readmeFileName, homepage, bugsURL, bugsEmail, licenceType, licenseURL, users) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING *`, [name, rev, description, readme, timeModified, timeCreated, repositoryType, repositoryURL, repositoryGithubOrg, repositoryGithubRepo, readmeFileName, homepage, bugsURL, bugsEmail, licenceType, licenseURL, users])
      return result
    } catch(err) {
      throw err
    }
  }
}

module.exports = packages