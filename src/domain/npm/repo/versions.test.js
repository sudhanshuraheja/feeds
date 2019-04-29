const versions = require('./versions')
const db = require('../../../lib/db')
const config = require('../../../lib/config')

describe('Repo Versions', () => {
  beforeAll(async () => {
    config.init()
    await db.connect()
    await db.truncate('versions')
  })

  afterAll(async () => {
    await db.end()
  })

  test('Check get', async () => {
    const result = await versions.get('node-dummy@1.1.1')
    expect(result.rows).toEqual([])
  })

  test('Check insert', async () => {
    await expect(
      versions.insert(null, 'pkg-name', '1.1.1', 'long description', '# homepage', 'git', 'http://github.com', 'org', 'repo', 'http://bugs.org', 'bugs@org.com', 'MIT', 'http://license.org', 'ms committer', 'ms.committer@org.com', '1.0.0', '7.0.0', 'abcdefghijklmnop', 'https://tar.org/tar', 'this is not deprecated')
    ).rejects.toThrow(/versions/)

    await versions.insert('npm@1.1.1', 'pkg-name', '1.1.1', 'long description', '# homepage', 'git', 'http://github.com', 'org', 'repo', 'http://bugs.org', 'bugs@org.com', 'MIT', 'http://license.org', 'ms committer', 'ms.committer@org.com', '1.0.0', '7.0.0', 'abcdefghijklmnop', 'https://tar.org/tar', 'this is not deprecated')
    const result = await versions.get('npm@1.1.1')
    expect(result.rows[0].id).toBe('npm@1.1.1')
  })
})