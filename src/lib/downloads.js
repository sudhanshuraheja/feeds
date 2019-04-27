const axios = require('axios')
const moment = require('moment')
const logger = require('./logger')('domain/downloads')

// Fetch data from this URL
// https://api.npmjs.org/downloads/point/2019-04-15:2019-04-21/jquery,npm,express

const downloads = {
  getFirstMondayOfYear: (year) => {
    let firstMondayDate = 0;
    for(let i = 1; i <= 7; i += 1) {
      if (moment(`${year}-01-${i}`, 'YYYY-MM-DD').isoWeekday() === 1) {
        firstMondayDate = i
      }
    }
    return moment(`${year}-01-${firstMondayDate}`, 'YYYY-MM-DD').format('YYYY-MM-DD')
  },

  url: (startDate, endDate, packages) => `https://api.npmjs.org/downloads/point/${startDate}:${endDate}/${packages.join(',')}`,

  api: async (startDate, endDate, packages) => {
    try {
      const result = await axios.get(downloads.url(startDate, endDate, packages))
      return result.data
    } catch (err) {
      logger.error(err)
      throw err
    }
  }

}

module.exports = downloads