const axios = require('axios')
const server = require('./')
const config = require('../config')

describe('Server', () => {

  beforeAll(() => {
    config.env.IS_TEST = true
  })

  afterAll(() => {
    config.env.IS_TEST = false
  })

  test('Start the web server', async () => {
    await server.init()

    const response = await axios.get(`http://0.0.0.0:${config.env.PORT}/health`)
    expect(response.data.status).toBe('UP')

    await server.release()
  })
})