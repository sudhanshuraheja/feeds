const config = require('../lib/config')
const logger = require('../lib/logger')('lib/replicate')
const db = require('../lib/db')
const npm = require('../domain/npm')

const replicate = {
  init: async () => {
    config.init()

    function handle(signal) {
      replicate.release(signal)
    }
    process.on('SIGINT', handle)
    process.on('SIGTERM', handle)
    process.on('uncaughtException', handle)
    process.on('cleanup', handle)
        
    await replicate.initDb()

    npm.start(replicate)
  },

  initDb: async () => {
    try {
      await db.connect()
    } catch(err) {
      logger.error(err)
      process.emit('cleanup')
    }    
  },

  release: async (reason) => {
    logger.info(`Found ${reason}, cleaning up`)
    await replicate.releaseDb()
    process.exit(0)
  },

  releaseDb: async () => {
    try {
      await db.end()
    } catch(err) {
      logger.error(err)
    }
  },

}

module.exports = replicate