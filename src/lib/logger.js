const { createLogger, format, transports } = require('winston')
const config = require('./config')

const logger = {
  init: (callingModule) => {
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
    logger.log.debug(`Starting logger with logLevel ${config.env.LOG_LEVEL}`)
    return logger.log
  }
}

module.exports = logger