const db = require('../../lib/npm')
const repo = require('./repo')
const logger = require('../../lib/logger')('domain/npm')

const npm = {
  start: () => {
    db.init(npm.process, 0)
  },

  process: (data, done) => {
    repo.sequence.insert(data.seq, data.id, data.changes[0].rev)
    logger.info(data.id)
    done()
  }

}

module.exports = npm