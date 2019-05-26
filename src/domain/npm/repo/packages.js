const joi = require('joi')
const db = require('../../../lib/db')
const log = require('../../../lib/logger')

const logger = log.init('npm/repo/packages')

const packages = {
  get: async (name) => {
    const schema = joi.object().keys({
      name: joi.string().required(),
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
      name: joi.string().required(),
      rev: joi.string().required(),
      description: joi.string().allow('').optional(),
      readme: joi.string().allow('').optional(),
      timeModified: joi.date().iso().required(),
      timeCreated: joi.date().iso().required(),
      repositoryType: joi.string().allow('').optional(),
      repositoryURL: joi.string().allow('').optional(),
      repositoryGithubOrg: joi.string().allow('').optional(),
      repositoryGithubRepo: joi.string().allow('').optional(),
      readmeFileName: joi.string().allow('').optional(),
      homepage: joi.string().allow('').optional(),
      bugsURL: joi.string().allow('').optional(),
      bugsEmail: joi.string().allow('').optional(),
      licenceType: joi.string().allow('').optional(),
      licenseURL: joi.string().allow('').optional(),
      users: joi.number().optional(),
    })

    const validation = joi.validate({ name, rev, description, readme, timeModified, timeCreated, repositoryType, repositoryURL, repositoryGithubOrg, repositoryGithubRepo, readmeFileName, homepage, bugsURL, bugsEmail, licenceType, licenseURL, users }, schema)
    if (validation.error) {
      logger.debug(`Packages: ${validation.error.details[0].context.key} :: ${validation.error.details[0].context.value}`)
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