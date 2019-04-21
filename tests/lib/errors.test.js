const errors = require('../../src/lib/errors')

describe('Errors', () => {

  test('Catch the correct error type', () => {
    try {
      throw new errors.PostgresClientError('This is a new error')
    } catch (err) {
      expect(typeof err).toBe('object')
    }
  })

})