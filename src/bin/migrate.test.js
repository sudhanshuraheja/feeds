const migrate = require('./migrate')
const config = require('../lib/config')
const db = require('../lib/db')

describe('Migrations', () => {

  beforeAll(async () => {
    config.init()
    await db.connect()
    migrate.init(`${__dirname}/../../migrations/`)
  })

  test('migrate to latest version', async () => {
    await migrate.to('all')
    const result = await db.tableExists('people')
    expect(result).toBe(true)
  })

  test('migrate to the first version', async () => {
    await migrate.to('000')
    const result = await db.tableExists('contributors')
    expect(result).toBe(false)
  })

  afterAll(async () => {
    await migrate.to('all')
    await db.end()
  })
})