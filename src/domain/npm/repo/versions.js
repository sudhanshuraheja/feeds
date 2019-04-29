const db = require('../../../lib/db')

const versions = {
  get: async (id) => {
    if (typeof id !== 'string') throw new Error('[versions] id should be a string')
    if (id.length > 128) throw new Error('[versions] id should be less than 128 chars')

    try {
      const result = await db.query(`SELECT * FROM versions WHERE id=$1`, [id])
      return result
    } catch (err) {
      throw err
    }
  },

  insert: async (id, name, version, description, homepage, repositoryType, repositoryURL, repositoryGithubOrg, repositoryGithubRepo, bugsURL, bugsEmail, licenceType, licenseURL, committerName, committerEmail, npmVersion, nodeVersion, distShasum, distTarball, deprecated) => {
    if (typeof id !== 'string') throw new Error('[versions] id should be a string')
    if (id.length > 128) throw new Error('[versions] id should be less than 128 chars')
    if (typeof name !== 'string') throw new Error('[versions] name should be a string')
    if (name.length > 128) throw new Error('[versions] name should be less than 128 chars')
    if (typeof version !== 'string') throw new Error('[versions] version should be a string')
    if (version.length > 128) throw new Error('[versions] version should be less than 128 chars')

    try {
      const result = await db.query(`INSERT INTO versions(id, name, version, description, homepage, repositoryType, repositoryURL, repositoryGithubOrg, repositoryGithubRepo, bugsURL, bugsEmail, licenceType, licenseURL, committerName, committerEmail, npmVersion, nodeVersion, distShasum, distTarball, deprecated) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20) RETURNING *`, [id, name, version, description, homepage, repositoryType, repositoryURL, repositoryGithubOrg, repositoryGithubRepo, bugsURL, bugsEmail, licenceType, licenseURL, committerName, committerEmail, npmVersion, nodeVersion, distShasum, distTarball, deprecated])
      return result
    } catch(err) {
      throw err
    }
  }
}

module.exports = versions

// CREATE TABLE IF NOT EXISTS versions (	
// 	id VARCHAR(128) PRIMARY KEY, -- npm@1.1.25
// 	name VARCHAR(128), -- npm
//   version VARCHAR(128), -- 1.1.25
// 	description VARCHAR(256),
// 	homepage VARCHAR(256),
// 	repositoryType VARCHAR(16),
// 	repositoryURL VARCHAR(256),
// 	repositoryGithubOrg VARCHAR(64),
// 	repositoryGithubRepo VARCHAR(64),
// 	bugsURL VARCHAR(256),
// 	bugsEmail VARCHAR(128),
// 	licenceType VARCHAR(64),
// 	licenseURL VARCHAR(256),
// 	committerName VARCHAR(128),
// 	committerEmail VARCHAR(128),
// 	npmVersion VARCHAR(32),
// 	nodeVersion VARCHAR(32),
// 	distShasum VARCHAR(64),
// 	distTarball VARCHAR(256),
// 	deprecated VARCHAR(256),
//   created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
//   updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
// );