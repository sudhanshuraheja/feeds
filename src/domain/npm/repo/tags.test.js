const tags = require('./tags')
const db = require('../../../lib/db')
const config = require('../../../lib/config')

describe('Repo Tags', () => {
  beforeAll(async () => {
    config.init()
    await db.connect()
    await db.truncate('tags')
  })

  afterAll(async () => {
    await db.end()
  })

  test('Check get', async () => {
    const result = await tags.get('names', 'tags')
    expect(result.rows).toEqual([])
  })

  test('Check insert', async () => {
    await expect(
      tags.insert(1, 'tag', 'version')
    ).rejects.toThrow(/tags/)

    const result = await tags.insert('name', 'tag', 'version')
    expect(result.rows[0].name).toBe('name')
  })
})