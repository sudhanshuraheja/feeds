const joi = require('joi')
const db = require('../../../lib/db')
const log = require('../../../lib/logger')

const logger = log.init('npm/repo/packages')

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
      description: joi.string().allow('').optional(),
      readme: joi.string().allow('').optional(),
      timeModified: joi.date().iso().required(),
      timeCreated: joi.date().iso().required(),
      repositoryType: joi.string().max(128).optional(),
      repositoryURL: joi.string().max(256).optional(),
      repositoryGithubOrg: joi.string().max(64).optional(),
      repositoryGithubRepo: joi.string().max(64).optional(),
      readmeFileName: joi.string().max(256).optional(),
      homepage: joi.string().max(256).optional(),
      bugsURL: joi.string().max(256).optional(),
      bugsEmail: joi.string().max(128).optional(),
      licenceType: joi.string().max(128).allow('').optional(),
      licenseURL: joi.string().max(256).optional(),
      users: joi.number().optional(),
    })

    const validation = joi.validate({ name, rev, description, readme, timeModified, timeCreated, repositoryType, repositoryURL, repositoryGithubOrg, repositoryGithubRepo, readmeFileName, homepage, bugsURL, bugsEmail, licenceType, licenseURL, users }, schema)
    if (validation.error) {
      logger.error(`Packages: ${name}, ${rev}, ${description}, ${readme}, ${timeModified}, ${timeCreated}, ${repositoryType}, ${repositoryURL}, ${repositoryGithubOrg}, ${repositoryGithubRepo}, ${readmeFileName}, ${homepage}, ${bugsURL}, ${bugsEmail}, ${licenceType}, ${licenseURL}, ${users}`)
      throw new Error(`Packages: ${validation.error.details[0].message}`)
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