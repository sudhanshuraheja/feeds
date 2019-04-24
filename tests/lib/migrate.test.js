const migrate = require('../../src/lib/migrate')
const config = require('../../src/lib/config')
const db = require('../../src/lib/db')

describe('Migrations', () => {

  beforeAll(async () => {
    config.init()
    await db.connect()
    migrate.init(`${__dirname}/../../migrations/`)
  })

  test('migrate to latest version', async () => {
    await migrate.to('005')
    const result = await db.tableExists('contributors')
    expect(result).toBe(true)
  })

  test('migrate to the first version', async () => {
    await migrate.to('000')
    const result = await db.tableExists('contributors')
    expect(result).toBe(false)
  })

  afterAll(async () => {
    await migrate.to()
    await db.end()
  })
})