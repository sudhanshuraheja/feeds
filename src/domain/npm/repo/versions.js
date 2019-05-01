const joi = require('joi')
const db = require('../../../lib/db')
const log = require('../../../lib/logger')

const logger = log.init('repo/npm/versions')

const versions = {
  get: async (id) => {
    const schema = joi.object().keys({
      id: joi.string().max(128).required(),
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
    const schema = joi.object().keys({
      id: joi.string().max(128).required(),
      name: joi.string().max(128).required(),
      version: joi.string().max(128).required(),
      description: joi.string().allow('').optional(),
      homepage: joi.string().max(256).allow('').optional(),
      repositoryType: joi.string().max(128).optional(),
      repositoryURL: joi.string().max(256).optional(),
      repositoryGithubOrg: joi.string().max(64).allow('').optional(),
      repositoryGithubRepo: joi.string().max(64).allow('').optional(),
      bugsURL: joi.string().max(256).optional(),
      bugsEmail: joi.string().max(128).optional(),
      licenceType: joi.string().max(64).allow('').optional(),
      licenseURL: joi.string().max(256).optional(),
      committerName: joi.string().max(128).required(),
      committerEmail: joi.string().max(128).required(),
      npmVersion: joi.string().max(32).optional(),
      nodeVersion: joi.string().max(32).optional(),
      distShasum: joi.string().max(64).optional(),
      distTarball: joi.string().max(256).optional(),
      deprecated: joi.string().max(256).optional(),
    })

    const validation = joi.validate({ id, name, version, description, homepage, repositoryType, repositoryURL, repositoryGithubOrg, repositoryGithubRepo, bugsURL, bugsEmail, licenceType, licenseURL, committerName, committerEmail, npmVersion, nodeVersion, distShasum, distTarball, deprecated }, schema)
    if (validation.error) {
      logger.error(`Versions: ${id}, ${name}, ${version}, ${description}, ${homepage}, ${repositoryType}, ${repositoryURL}, ${repositoryGithubOrg}, ${repositoryGithubRepo}, ${bugsURL}, ${bugsEmail}, ${licenceType}, ${licenseURL}, ${committerName}, ${committerEmail}, ${npmVersion}, ${nodeVersion}, ${distShasum}, ${distTarball}, ${deprecated}`)
      throw new Error(`Versions: ${validation.error.details[0].message}`)
    }

    try {
      const result = await db.query(`INSERT INTO versions(id, name, version, description, homepage, repositoryType, repositoryURL, repositoryGithubOrg, repositoryGithubRepo, bugsURL, bugsEmail, licenceType, licenseURL, committerName, committerEmail, npmVersion, nodeVersion, distShasum, distTarball, deprecated) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20) RETURNING *`, [id, name, version, description, homepage, repositoryType, repositoryURL, repositoryGithubOrg, repositoryGithubRepo, bugsURL, bugsEmail, licenceType, licenseURL, committerName, committerEmail, npmVersion, nodeVersion, distShasum, distTarball, deprecated])
      return result
    } catch(err) {
      throw err
    }
  }
}

module.exports = versions