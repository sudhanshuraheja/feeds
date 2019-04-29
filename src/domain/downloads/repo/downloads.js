const db = require('../../../lib/db')

const downloads = {
  get: async (uuid) => {
    if (typeof uuid !== 'string') throw new Error('[downloads] uuid should be a string')

    try {
      const result = await db.query(`SELECT * FROM downloads WHERE uuid=$1`, [uuid])
      return result
    } catch (err) {
      throw err
    }
  },

  insert: async (name, startTime, endTime, downloadCount) => {
    if (typeof name !== 'string') throw new Error('[downloads] name should be a string')
    if (name.length > 128) throw new Error('[downloads] name should be less than 128 chars')
    if (typeof startTime !== 'string') throw new Error('[downloads] startTime should be a string')
    if (typeof endTime !== 'string') throw new Error('[downloads] endTime should be a string')
    if (!Number.isInteger(downloadCount)) throw new Error('[downloads] downloadCount should be an integer')
    if (downloadCount < 0) throw new Error('[downloads] downloadCount should be greater than 0')


    try {
      const result = await db.query(`INSERT INTO downloads(name, startTime, endTime, downloads) VALUES($1, $2, $3, $4) RETURNING *`, [name, startTime, endTime, downloadCount])
      return result
    } catch(err) {
      throw err
    }
  }
}

module.exports = downloads