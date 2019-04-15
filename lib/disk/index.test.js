const disk = require('./')

describe('Disk', () => {
  test('Read files from disk', async () => {
    const file = await disk.readFile('./lib/disk/index.js')
    expect(file).toMatch(`module.exports = disk`)

    try {
      await disk.readFile('./lib/disk/index.js.fake')
    } catch(e) {
      expect(e.message).toMatch(`ENOENT`)
    }
    
  })
  
  test('Read folders from disk', async () => {
    const files = await disk.readFolder('./lib/disk')
    expect(files).toContain('index.test.js')

    try {
      await disk.readFolder('./lib/disk/fake')
    } catch(e) {
      expect(e.message).toMatch('ENOENT')
    }
  })
})