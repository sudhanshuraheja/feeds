const sequence = require('./sequence')
const db = require('../../../lib/db')
const config = require('../../../lib/config')

describe('Repo Seq', () => {
  beforeAll(async () => {
    config.init()
    await db.connect()
    await db.truncate('sequence')
  })

  afterAll(async () => {
    await db.end()
  })

  test('Check get', async () => {
    const result = await sequence.get(1)
    expect(result.rows).toEqual([])
  })

  test('Check insert', async () => {
    await expect(
      sequence.insert(-1, 'id', 'rev')
    ).rejects.toThrow(/seq/)

    await sequence.insert(1, 'id', 'rev')
    const result = await sequence.get(1)
    expect(result.rows[0].name).toBe('id')
  })
})