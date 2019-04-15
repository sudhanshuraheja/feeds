const config = require('./')

describe('Config', () => {
  test('Check if working', () => {
    expect(config.LOG_LEVEL).toBe('debug')
  })
})