const db = require('../../../lib/db')

const sequence = {
  get: async (seq) => {
    if (!Number.isInteger(seq)) throw new Error('[sequence] Sequence should be an integer')
    if (seq <= 0) throw new Error('[sequence] Sequence should be greater than 0')

    try {
      const result = await db.query(`SELECT * FROM sequence WHERE seq=$1`, [seq])
      return result
    } catch (err) {
      throw err
    }
  },

  insert: async (seq, name, rev) => {
    if (!Number.isInteger(seq)) throw new Error('[sequence] seq should be an integer')
    if (seq <= 0) throw new Error('[sequence] seq should be greater than 0')
    if (typeof name !== 'string') throw new Error('[sequence] name should be a string')
    if (name.length > 128) throw new Error('[sequence] name should be less than 128 chars')
    if (typeof rev !== 'string') throw new Error('[sequence] rev should be a string')
    if (rev.length > 64) throw new Error('[sequence] rev should be less than 64 chars')

    try {
      const result = await db.query(`INSERT INTO sequence(seq, name, rev) VALUES($1, $2, $3) RETURNING *`, [seq, name, rev])
      return result
    } catch(err) {
      throw err
    }
  }
}

module.exports = sequence