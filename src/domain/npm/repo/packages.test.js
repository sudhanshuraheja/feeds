const moment = require('moment')
const packages = require('./packages')
const db = require('../../../lib/db')
const config = require('../../../lib/config')

describe('Repo Packages', () => {
  beforeAll(async () => {
    config.init()
    await db.connect()
    await db.truncate('packages')
  })

  afterAll(async () => {
    await db.end()
  })

  test('Check get', async () => {
    const result = await packages.get('node-dummy')
    expect(result.rows).toEqual([])
  })

  test('Check insert', async () => {
    const now = moment().format()
    await expect(
      packages.insert(-1, 'pkg-rev', 'long description', '#readme', now, now, 'git', 'git://url', 'org', 'repo', 'readme.md', 'https://homepage.org', 'http://bugs.org', 'bugs@org.com', 'MIT', 'http://license.org', 15)
    ).rejects.toThrow(/packages/)

    const updated = moment('2013-03-16T18:45:36.782Z').format()
    await packages.insert('pkg-name', 'pkg-rev', 'long description', '#readme', now, updated, 'git', 'git://url', 'org', 'repo', 'readme.md', 'https://homepage.org', 'http://bugs.org', 'bugs@org.com', 'MIT', 'http://license.org', 15)
    const result = await packages.get('pkg-name')
    expect(result.rows[0].name).toBe('pkg-name')
  })
})