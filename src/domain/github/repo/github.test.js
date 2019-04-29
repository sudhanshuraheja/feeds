const github = require('./github')
const db = require('../../../lib/db')
const config = require('../../../lib/config')

describe('Repo Github', () => {
  beforeAll(async () => {
    config.init()
    await db.connect()
    await db.truncate('github')
  })

  afterAll(async () => {
    await db.end()
  })

  test('Check get', async () => {
    const result = await github.get('0db8b6da-d2db-4adb-8cde-9864b432c66f')
    expect(result.rows).toEqual([])
  })

  test('Check insert', async () => {
    await expect(
      github.insert('name', 'avatarURL', 'description', 'createdAt', 'updatedAt', 'pushedAt', 'homepage', 'size', 'stars', 'subscribers', 'forks', 'openIssueCount', 'language', 'licence', 'archived', 'disabled')
    ).rejects.toThrow(/github/)

    const result = await github.insert('name', 'avatarURL', 'description', '2013-03-16T18:45:36.782Z', '2013-03-16T18:45:36.782Z', '2013-03-16T18:45:36.782Z', 'homepage', 2000, 5, 2, 2, 7, 'language', 'licence', false, false)
    expect(result.rows[0].name).toBe('name')
  })
})