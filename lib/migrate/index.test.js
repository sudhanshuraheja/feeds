const migrate = require('./')
const config = require('../config')
const db = require('../db')

describe('Migrations', () => {

  beforeAll(async () => {
    config.init()
    await db.connect()
    migrate.init(`${__dirname}/testsql`)
  })

  test('migrate to latest version', async () => {
    await migrate.to('all')
    const result = await db.tableExists('temp_migrations_table2')
    expect(result).toBe(true)
  })

  test('migrate to the first version', async () => {
    await migrate.to('000')
    const result = await db.tableExists('temp_migrations_table')
    expect(result).toBe(false)
  })

  afterAll(async () => {
    await db.end()
  })
})