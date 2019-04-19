const Postgrator = require('postgrator')
const config = require('../config')
const logger = require('../config/logger')

const migrate = {

  grator: null,

  init: (migrationsFolder) => {
    config.init()

    migrate.grator = new Postgrator({
      migrationDirectory: migrationsFolder,
      driver: 'pg',
      host: config.env.PG_HOST,
      port: config.env.PG_PORT,
      database: config.env.PG_DATABASE,
      username: config.env.PG_USER,
      password: config.env.PG_PASS
    })
  },

  to: async (version) => {
    try {
      if (version === 'all') {
        await migrate.grator.migrate()
      } else {
        await migrate.grator.migrate(version)
      }
    } catch(err) {
      logger.error(err)
      throw err
    }
    
  },

}

module.exports = migrate