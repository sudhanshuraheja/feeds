const { createLogger, format, transports } = require('winston')
const config = require('./config')

const logger = {
  log: null,
  init: (callingModule) => {
    if (logger.log) return logger.log

    config.init()
    
    // eslint-disable-next-line new-cap
    logger.log = new createLogger({
      level: config.env.LOG_LEVEL,
      format: format.combine(
        format.colorize(),
        format.label({
          label: callingModule
        }),
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.simple()
      ),
      transports: [
        new transports.Console({})
      ],
      exitOnError: false
    })

    logger.log.info(`Starting logger with logLevel ${config.env.LOG_LEVEL}`)

    return logger.log
  }
}

module.exports = logger