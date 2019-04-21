const cache = require('../../src/lib/cache')

describe ('Redis Cache', () => {

  test('Connect to Redis', async () => {
    cache.connect()
    expect(cache.client).not.toBeNull()

    cache.quit()
  })

})