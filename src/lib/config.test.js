const path = require('path')
const config = require('../../src/lib/config')

describe('Config', () => {
  test('Check if it reads the correct value from the .test.env file', () => {
    config.init(path.join(process.cwd(), '/tests/.test.env'))
    expect(config.env.PORT).toBe('5432')
  })
})