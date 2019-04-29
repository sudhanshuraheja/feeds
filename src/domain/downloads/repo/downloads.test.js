const downloads = require('./downloads')
const db = require('../../../lib/db')
const config = require('../../../lib/config')

describe('Repo Downloads', () => {
  beforeAll(async () => {
    config.init()
    await db.connect()
    await db.truncate('downloads')
  })

  afterAll(async () => {
    await db.end()
  })

  test('Check get', async () => {
    const result = await downloads.get('0db8b6da-d2db-4adb-8cde-9864b432c66f')
    expect(result.rows).toEqual([])
  })

  test('Check insert', async () => {
    await expect(
      downloads.insert('name', 'startTime', 'endTime', 'downloadCount')
    ).rejects.toThrow(/downloadCount/)

    const result = await downloads.insert('name', '2013-03-16T18:45:36.782Z', '2013-03-16T18:45:36.782Z', 24500)
    expect(result.rows[0].name).toBe('name')
  })
})