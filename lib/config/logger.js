const { createLogger, format, transports } = require('winston')
const path = require('path')
const config = require('./index')

const logger = (callingModule) => {
  return new createLogger({
    level: config.logLevel,
    format: format.combine(
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