const db = require('../../../lib/db')

const github = {
  get: async (uuid) => {
    if (typeof uuid !== 'string') throw new Error('[github] uuid should be a string')

    try {
      const result = await db.query(`SELECT * FROM github WHERE uuid=$1`, [uuid])
      return result
    } catch (err) {
      throw err
    }
  },

  insert: async (name, avatarURL, description, createdAt, updatedAt, pushedAt, homepage, size, stars, subscribers, forks, openIssueCount, language, licence, archived, disabled) => {
    if (typeof name !== 'string') throw new Error('[github] name should be a string')
    if (name.length > 128) throw new Error('[github] name should be less than 128 chars')
    if (typeof avatarURL !== 'string') throw new Error('[github] avatarURL should be a string')
    if (avatarURL.length > 128) throw new Error('[github] avatarURL should be less than 128 chars')
    if (typeof description !== 'string') throw new Error('[github] description should be a string')
    if (description.length > 512) throw new Error('[github] description should be less than 128 chars')
    if (typeof createdAt !== 'string') throw new Error('[github] createdAt should be a string')
    if (typeof updatedAt !== 'string') throw new Error('[github] updatedAt should be a string')
    if (typeof pushedAt !== 'string') throw new Error('[github] pushedAt should be a string')
    if (typeof homepage !== 'string') throw new Error('[github] homepage should be a string')
    if (homepage.length > 128) throw new Error('[github] homepage should be less than 128 chars')
    if (!Number.isInteger(size)) throw new Error('[github] size should be an integer')
    if (size < 0) throw new Error('[github] size should be greater than 0')
    if (!Number.isInteger(stars)) throw new Error('[github] stars should be an integer')
    if (stars < 0) throw new Error('[github] stars should be greater than 0')
    if (!Number.isInteger(subscribers)) throw new Error('[github] subscribers should be an integer')
    if (subscribers < 0) throw new Error('[github] subscribers should be greater than 0')
    if (!Number.isInteger(forks)) throw new Error('[github] forks should be an integer')
    if (forks < 0) throw new Error('[github] forks should be greater than 0')
    if (!Number.isInteger(openIssueCount)) throw new Error('[github] openIssueCount should be an integer')
    if (openIssueCount < 0) throw new Error('[github] openIssueCount should be greater than 0')
    if (typeof language !== 'string') throw new Error('[github] language should be a string')
    if (language.length > 32) throw new Error('[github] language should be less than 128 chars')
    if (typeof licence !== 'string') throw new Error('[github] licence should be a string')
    if (licence.length > 16) throw new Error('[github] licence should be less than 128 chars')
    if (typeof archived !== 'boolean') throw new Error('[github] archived should be a bool')
    if (typeof disabled !== 'boolean') throw new Error('[github] disabled should be a bool')

    try {
      const result = await db.query(`INSERT INTO github(name, avatarURL, description, createdAt, updatedAt, pushedAt, homepage, size, stars, subscribers, forks, openIssueCount, language, licence, archived, disabled) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *`, [name, avatarURL, description, createdAt, updatedAt, pushedAt, homepage, size, stars, subscribers, forks, openIssueCount, language, licence, archived, disabled])
      return result
    } catch(err) {
      throw err
    }
  }
}

module.exports = github