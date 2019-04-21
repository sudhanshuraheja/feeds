const fs = require('fs')
const errors = require('./errors')

const disk = {

  readFolder: (folderPath) => {
    return new Promise((resolve, reject) => {
      fs.readdir(folderPath, (err, files) => {
        if (err) {
          reject(new errors.FileError(err))
        } else {
          resolve(files)
        }
      })
    })
  },

  readFile: (path) => {
    return new Promise((resolve, reject) => {
      fs.readFile(path, 'utf8', (err, data) => {
        if (err) {
          reject(new errors.FileError(err))
        } else {
          resolve(data)
        }
      })
    })
  }

}

module.exports = disk