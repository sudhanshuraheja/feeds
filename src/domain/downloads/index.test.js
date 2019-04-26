const nock = require('nock')
const downloads = require('./index')

nock(`https://api.npmjs.org`)
  .get(`/downloads/point/2019-04-15:2019-04-21/jquery,npm,express`)
  .reply(200, {
    "jquery": {
        "downloads": 2276060,
        "package": "jquery",
        "start": "2019-04-15",
        "end": "2019-04-21"
    },
    "npm": {
        "downloads": 1493442,
        "package": "npm",
        "start": "2019-04-15",
        "end": "2019-04-21"
    },
    "express": {
        "downloads": 7197810,
        "package": "express",
        "start": "2019-04-15",
        "end": "2019-04-21"
    }
})

describe('Downloads', () => {

    test('First monday of the year', () => {
        expect(downloads.getFirstMondayOfYear(2015)).toBe("2015-01-05")
        expect(downloads.getFirstMondayOfYear(2016)).toBe("2016-01-04")
        expect(downloads.getFirstMondayOfYear(2017)).toBe("2017-01-02")
        expect(downloads.getFirstMondayOfYear(2018)).toBe("2018-01-01")
        expect(downloads.getFirstMondayOfYear(2019)).toBe("2019-01-07")
    })

    test('Get URL', () => {
        expect(downloads.url('2019-01-01', '2019-01-06', ['express', 'npm']))
            .toBe('https://api.npmjs.org/downloads/point/2019-01-01:2019-01-06/express,npm')
    })

    test('API call to get downloads', async () => {
        const response = await downloads.api('2019-04-15', '2019-04-21', ['jquery', 'npm', 'express' ])
        expect(response.express.downloads).toBe(7197810)
        expect(response.express.start).toBe(`2019-04-15`)
        expect(response.express.end).toBe(`2019-04-21`)
    })
})