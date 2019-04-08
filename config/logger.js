const { createLogger, format, transports } = require('winston')
const path = require('path')

const logger = (callingModule) => {
  return new createLogger({
    level: 'debug',
    format: format.combine(
      format.label({
        label: callingModule.filename.split(path.sep).slice(-2).join('/')
      }),
      format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
      }),
      format.json()
    ),
    transports: [
      new transports.Console({})
    ],
    exitOnError: false
  })  
}

module.exports = logger