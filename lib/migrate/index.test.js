const migrate = require('./')
const config = require('../config')
const db = require('../db')

describe('Migrations', () => {

  beforeAll(async () => {
    config.init()
    await db.connect()
    const exists = await db.tableExists('schemaversion')
    if (exists) {
      await db.query(`DROP TABLE schemaversion;`)
    }
    migrate.init(`${__dirname}/../../migrations/`)
  })

  test('migrate to latest version', async () => {
    await migrate.to('005')
    const result = await db.tableExists('sources')
    expect(result).toBe(true)
  })

  test('migrate to the first version', async () => {
    await migrate.to('000')
    const result = await db.tableExists('sources')
    expect(result).toBe(false)
  })

  afterAll(async () => {
    await db.end()
  })
})