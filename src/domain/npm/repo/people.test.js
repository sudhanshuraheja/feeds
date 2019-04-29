const people = require('./people')
const db = require('../../../lib/db')
const config = require('../../../lib/config')

describe('Repo People', () => {
  beforeAll(async () => {
    config.init()
    await db.connect()
    await db.truncate('people')
  })

  afterAll(async () => {
    await db.end()
  })

  test('Check get', async () => {
    const result = await people.get('names', 'version')
    expect(result.rows).toEqual([])
  })

  test('Check insert', async () => {
    await expect(
      people.insert('name', 'version', 'email', 'fullname', 'url', 'type')
    ).rejects.toThrow(/people/)

    const result = await people.insert('name', 'version', 'email', 'fullname', 'url', 'author')
    expect(result.rows[0].name).toBe('name')
  })
})