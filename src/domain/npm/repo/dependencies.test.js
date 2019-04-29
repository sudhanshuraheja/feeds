const dependencies = require('./dependencies')
const db = require('../../../lib/db')
const config = require('../../../lib/config')

describe('Repo Dependencies', () => {
  beforeAll(async () => {
    config.init()
    await db.connect()
    await db.truncate('dependencies')
  })

  afterAll(async () => {
    await db.end()
  })

  test('Check depend get', async () => {
    const result = await dependencies.get('name', 'version')
    expect(result.rows).toEqual([])
  })

  test('Check insert', async () => {
    await expect(
      dependencies.insert('name', 'version', 'dependency', 'semver', 'url', 'type')
    ).rejects.toThrow(/type/)

    const result = await dependencies.insert('name', 'version', 'dependency', 'semver', 'url', 'dep')
    expect(result.rows[0].name).toBe('name')
  })
})