const db = require('../../db')

const migrateStore = {

  init: async () => {
    await db.connect()
  },

  release: async () => {
    await db.end()
  },

  setup: async () => {
    await db.query(`CREATE TABLE IF NOT EXISTS migrations (
      tag varchar(16) PRIMARY KEY,
      step varchar(512) NOT NULL,
      migrated bigint NOT NULL
    )`, [])
  },

  get: async () => {
    const result = await db.query(`SELECT * FROM migrations`, [])
    return result
  },

  update: async (step) => {
    await db.query(`UPDATE migrations SET step=$1, migrated=$2 WHERE tag='latest'`, [step, Date.now()])
  },

  add: async (step) => {
    await db.query(`INSERT INTO migrations(tag, step, migrated) VALUES ('latest', $1, $2)`, [step, Date.now()])
  },

  processSQL: async (data) => {
    const queries = []
    const querySeparator = `;\n`
    for (let i = 0; i < data.split(querySeparator).length; i += 1 ) {
      const query = data.split(querySeparator)[i].replace(/\n/g, '')
      if (query !== '') {
        queries.push({ statement: `${query};`, params: [] })
      }
    }
    await db.transaction(queries)
  } 

}

module.exports = migrateStore