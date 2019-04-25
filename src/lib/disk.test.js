const disk = require('./disk')

describe('Disk', () => {
  test('Read files from disk', async () => {
    const file = await disk.readFile('./src/lib/disk.js')
    expect(file).toMatch(`module.exports = disk`)

    try {
      await disk.readFile('./src/lib/disk.js.fake')
    } catch(e) {
      expect(e.message).toMatch(`ENOENT`)
    }
    
  })
  
  test('Read folders from disk', async () => {
    const files = await disk.readFolder('./src/lib')
    expect(files).toContain('disk.js')

    try {
      await disk.readFolder('./src/lib/fake')
    } catch(e) {
      expect(e.message).toMatch('ENOENT')
    }
  })
})