const path = require('path')
const config = require('./')

describe('Config', () => {
  test('Check if it reads the correct value from the .test.env file', () => {
    config.init(path.join(process.cwd(), '/lib/config/.test.env'))
    expect(config.env.PORT).toBe('5432')
  })
})