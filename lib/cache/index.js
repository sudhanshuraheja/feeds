const redis = require("redis")
const {promisify} = require('util');
const config = require('../config')
const errors = require('../errors')
const logger = require('../config/logger')('lib/cache')

const cache = {

  client: null,

  connect: () => {
    cache.client = redis.createClient({
      host: config.redis_host,
      port: config.redis_port,
      socket_keepalive: config.redis_socket_keepalive,
      password: config.redis_password,
      retry_strategy: (options) => {
        if(options.error && options.error.code === "ECONNREFUSED") {
          return new errors.RedisError('The server refused the connection')
        }

        if (options.total_retry_time > 1000 * 60 * 60) {
          return new errors.RedisError('Rety time exhausted')
        }

        if (options.attempt > 10) {
          return undefined
        }

        return Math.min(options.attempt * 100, 3000)
      }
    })
  },

  quit: () => {
    cache.client.quit()
  },

  connectEvent: (err) => {
    logger.error(`Redis encountered an error ${err}`)
  },

  readyEvent: () => {
    logger.info(`Redis is ready to start accepting`)
  },

  reconnectingEvent: (delay, attempt) => {
    logger.info(`Redis will reconnect ${attempt} times with ${delay}ms delay`)
  },

  endEvent: () => {
    logger.info(`Redis connection has ended`)
  }
}

cache.getAsync = promisify(cache.client.get).bind(cache.client)

cache.client.on('error', cache.connectEvent)
cache.client.on('ready', cache.readyEvent)
cache.client.on('reconnecting', cache.reconnectingEvent)
cache.client.on('end', cache.endEvent)

module.exports = cache