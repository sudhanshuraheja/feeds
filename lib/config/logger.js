const { createLogger, format, transports } = require('winston')
const config = require('./index')

const logger = (callingModule) => {
  // eslint-disable-next-line new-cap
  return new createLogger({
    level: config.logLevel,
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
}

module.exports = logger