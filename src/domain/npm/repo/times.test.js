const times = require('./times')
const db = require('../../../lib/db')
const config = require('../../../lib/config')

describe('Repo Times', () => {
  beforeAll(async () => {
    config.init()
    await db.connect()
    await db.truncate('times')
  })

  afterAll(async () => {
    await db.end()
  })

  test('Check get', async () => {
    const result = await times.get('names', 'version')
    expect(result.rows).toEqual([])
  })

  test('Check insert', async () => {
    await expect(
      times.insert(0, 'version', '2013-03-16T18:45:36.782Z')
    ).rejects.toThrow(/times/)

    const result = await times.insert('name', 'version', '2013-03-16T18:45:36.782Z')
    expect(result.rows[0].name).toBe('name')
  })
})