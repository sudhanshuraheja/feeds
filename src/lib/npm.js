const couch = require('changes-stream')
const backPressure = require('pressure-stream')
const log = require('./logger')

const logger = log.init('domain/npm')

// Fetch data from this URL
// https://replicate.npmjs.com

const npm = {
  replicate: null,
  pressure: null,

  config: {
    db: 'https://replicate.npmjs.com',
    since: 0,
    include_docs: true,
    concurrency: 1
  },

  init: (handler, start) => {
    npm.config.since = start
    logger.debug(`Starting with sequence ${start}`)
    npm.replicate = couch(npm.config)
    npm.pressure = backPressure((blob, next) => {
      handler(blob, (err, data) => {
        next(err, data)
      })
    }, npm.config.concurrency)
  
    npm.replicate.on('error', (err) => {
      npm.pressure.emit('error', err)
    })
  
    npm.replicate.pipe(npm.pressure)
    logger.debug(`CouchDB and Backpressure have been setup`)
  },

  release: () => {
    npm.replicate.destroy()
    npm.pressure.destroy()
  }

}

module.exports = npm