const npm = require('./npm')

describe('NPM', () => {

    test('Get data from couchdb', testDone => {
      npm.init((data, done) => {
        expect(data.id).toBe("node-dummy")
        done()
        npm.release()
        testDone()
      }, 0)
    })

})
