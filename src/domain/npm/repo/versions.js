const joi = require('joi')
const db = require('../../../lib/db')
const log = require('../../../lib/logger')

const logger = log.init('repo/npm/versions')

const versions = {
  get: async (id) => {
    const schema = joi.object().keys({
      id: joi.string().required(),
    })

    const validation = joi.validate({ id }, schema)
    if (validation.error) {
      throw new Error(validation.error.details[0].message)
    }

    try {
      const result = await db.query(`SELECT * FROM versions WHERE id=$1`, [id])
      return result
    } catch (err) {
      throw err
    }
  },

  insert: async (id, name, version, description, homepage, repositoryType, repositoryURL, repositoryGithubOrg, repositoryGithubRepo, bugsURL, bugsEmail, licenceType, licenseURL, committerName, committerEmail, npmVersion, nodeVersion, distShasum, distTarball, deprecated) => {
    const fixedDescription = description ? description.replace(/\0/g, '') : ''
    const schema = joi.object().keys({
      id: joi.string().required(),
      name: joi.string().required(),
      version: joi.string().required(),
      fixedDescription: joi.string().allow('').optional(),
      homepage: joi.string().allow('').optional(),
      repositoryType: joi.string().allow('').optional(),
      repositoryURL: joi.string().allow('').optional(),
      repositoryGithubOrg: joi.string().allow('').optional(),
      repositoryGithubRepo: joi.string().allow('').optional(),
      bugsURL: joi.string().allow('').optional(),
      bugsEmail: joi.string().allow('').optional(),
      licenceType: joi.string().allow('').optional(),
      licenseURL: joi.string().allow('').optional(),
      committerName: joi.string().allow('').required(),
      committerEmail: joi.string().allow('').required(),
      npmVersion: joi.string().allow('').optional(),
      nodeVersion: joi.string().allow('').optional(),
      distShasum: joi.string().optional(),
      distTarball: joi.string().optional(),
      deprecated: joi.string().optional(),
    })

    const validation = joi.validate({ id, name, version, fixedDescription, homepage, repositoryType, repositoryURL, repositoryGithubOrg, repositoryGithubRepo, bugsURL, bugsEmail, licenceType, licenseURL, committerName, committerEmail, npmVersion, nodeVersion, distShasum, distTarball, deprecated }, schema)
    if (validation.error) {
      logger.debug(`Versions: ${validation.error.details[0].context.key} :: ${validation.error.details[0].context.value}`)
      throw new Error(`Versions: ${validation.error.details[0].message}`)
    }

    try {
      const result = await db.query(`INSERT INTO versions(id, name, version, description, homepage, repositoryType, repositoryURL, repositoryGithubOrg, repositoryGithubRepo, bugsURL, bugsEmail, licenceType, licenseURL, committerName, committerEmail, npmVersion, nodeVersion, distShasum, distTarball, deprecated) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20) RETURNING *`, [id, name, version, fixedDescription, homepage, repositoryType, repositoryURL, repositoryGithubOrg, repositoryGithubRepo, bugsURL, bugsEmail, licenceType, licenseURL, committerName, committerEmail, npmVersion, nodeVersion, distShasum, distTarball, deprecated])
      return result
    } catch(err) {
      throw err
    }
  }
}

module.exports = versions