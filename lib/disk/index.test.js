const disk = require('./')

const diskTest = {
  init: () => {
    diskTest.readFile()
    diskTest.readFolder()
  },

  readFile: async () => {
    const file = await disk.readFile('./lib/disk/index.js')
    console.log(file)
  },

  readFolder: async () => {
    const files = await disk.readFolder('./lib/disk')
    if(files.length !== 2) {
      console.log(`✗ Incorrect files in ./lib/disk`)
      console.log(files)
    }
  }
}

diskTest.init()