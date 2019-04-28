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

  insert: async (seq, id, rev) => {
    if (!Number.isInteger(seq)) throw new Error('[sequence] seq should be an integer')
    if (seq <= 0) throw new Error('[sequence] seq should be greater than 0')
    if (typeof id !== 'string') throw new Error('[sequence] id should be a string')
    if (id.length > 128) throw new Error('[sequence] id should be less than 128 chars')
    if (typeof rev !== 'string') throw new Error('[sequence] rev should be a string')
    if (rev.length > 64) throw new Error('[sequence] rev should be less than 64 chars')

    try {
      const result = await db.query(`INSERT INTO sequence(seq, id, rev) VALUES($1, $2, $3) RETURNING *`, [seq, id, rev])
      return result
    } catch(err) {
      throw err
    }
  }
}

module.exports = sequence

// CREATE TABLE IF NOT EXISTS seq (
// 	seq BIGINT PRIMARY KEY,
// 	id VARCHAR(128),
// 	rev VARCHAR(64),
// 	created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
// 	updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
// );
