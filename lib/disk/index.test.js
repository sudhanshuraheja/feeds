const disk = require('./')

describe('Disk', () => {
  it('reads files properly', async () => {
    const file = await disk.readFile('./lib/disk/index.js')
    expect(file).toMatch(`module.exports = disk`)
  })
  
  it('reads folders properly', async () => {
    const files = await disk.readFolder('./lib/disk')
    expect(files).toContain('index.test.js')
  })
})