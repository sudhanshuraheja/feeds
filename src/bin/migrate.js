const Postgrator = require('postgrator')
const config = require('../lib/config')
const logger = require('../lib/logger')('lib/migrate')

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
        logger.info(`Migrated all`)
      } else {
        await migrate.grator.migrate(version)
        logger.info(`Migrated to ${version}`)
      }
    } catch(err) {
      logger.error(err)
    }
    
  },

}

module.exports = migrate