const keywords = require('./keywords')
const db = require('../../../lib/db')
const config = require('../../../lib/config')

describe('Repo Keywords', () => {
  beforeAll(async () => {
    config.init()
    await db.connect()
    await db.truncate('keywords')
  })

  afterAll(async () => {
    await db.end()
  })

  test('Check get', async () => {
    const result = await keywords.get('names', 'keywords')
    expect(result.rows).toEqual([])
  })

  test('Check insert', async () => {
    await expect(
      keywords.insert(1, 'version', 'keyword')
    ).rejects.toThrow(/keywords/)

    const result = await keywords.insert('name', 'version', 'keyword')
    expect(result.rows[0].name).toBe('name')
  })
})