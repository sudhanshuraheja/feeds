const axios = require('axios')
const logger = require('../../lib/logger')('domain/github')

// Fetch data from this URL
// https://api.github.com/repos/expressjs/express

const github = {
  url: (org, repo) => `https://api.github.com/repos/${org}/${repo}`,

  api: async (org, repo) => {
    try {
      const result = await axios.get(github.url(org, repo))
      return result.data
    } catch (err) {
      logger.error(err)
      throw err
    }
  }

}

module.exports = github