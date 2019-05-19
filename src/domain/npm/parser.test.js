const parser = require('./parser')

describe('Test Parser', () => {
    test('Check github url and repo', () => {
        expect(parser.splitGithubURL("git+https://github.com/axios/axios1.git").githubOrg).toBe('axios')
        expect(parser.splitGithubURL("git+https://github.com/axios/axios1.git").githubRepo).toBe('axios1')
        expect(parser.splitGithubURL("git://github.com/axios/axios1.git").githubOrg).toBe('axios')
        expect(parser.splitGithubURL("git://github.com/axios/axios1.git").githubRepo).toBe('axios1')
        expect(parser.splitGithubURL("https://github.com/axios/axios1.git").githubOrg).toBe('axios')
        expect(parser.splitGithubURL("https://github.com/axios/axios1.git").githubRepo).toBe('axios1')
        expect(parser.splitGithubURL("https://github.com/axios/axios1").githubOrg).toBe('axios')
        expect(parser.splitGithubURL("https://github.com/axios/axios1").githubRepo).toBe('axios1')
    
        expect(parser.splitGithubURL("git+https://github.com/incentro/generator-frontend-incubator.git#0a9be37865cc65447298fca1f2cbe21a24d397e9").githubOrg).toBe('incentro')
        expect(parser.splitGithubURL("git+https://github.com/incentro/generator-frontend-incubator.git#0a9be37865cc65447298fca1f2cbe21a24d397e9").githubRepo).toBe('generator-frontend-incubator')
        
      })
    
      test('Check licences', () => {
        const license1 = "MIT"
        const license2 = "Apache, Version 2.0"
        const license3 = [{ "type": "MIT", "url": "http://lodash.com/license" }]
        const license4 = [{ "type": "MIT +no-false-attribs", "url": "https://github.com/isaacs/npm/raw/master/LICENSE" }]
        const license5 = { "type": "MIT", "url": "https://github.com/bradmartin/nativescript-panorama-imageview/blob/master/LICENSE"}
        const license6 = ""
    
        expect(parser.splitLicense(license1).licenceType).toBe("MIT")
        expect(parser.splitLicense(license1).licenceURL).toBe(undefined)
        expect(parser.splitLicense(license2).licenceType).toBe("Apache, Version 2.0")
        expect(parser.splitLicense(license2).licenceURL).toBe(undefined)
        expect(parser.splitLicense(license3).licenceType).toBe("MIT")
        expect(parser.splitLicense(license3).licenceURL).toBe("http://lodash.com/license")
        expect(parser.splitLicense(license4).licenceType).toBe("MIT +no-false-attribs")
        expect(parser.splitLicense(license4).licenceURL).toBe("https://github.com/isaacs/npm/raw/master/LICENSE")
        expect(parser.splitLicense(license5).licenceType).toBe("MIT")
        expect(parser.splitLicense(license5).licenceURL).toBe("https://github.com/bradmartin/nativescript-panorama-imageview/blob/master/LICENSE")
        expect(parser.splitLicense(license6).licenceType).toBe(undefined)
        expect(parser.splitLicense(license6).licenceURL).toBe(undefined)
      })
    
      test('Check split person', () => {
        const person1 = { "name": "npm", "email": "npm@npmjs.com" }
        const person2 = "Azer Koçulu <azer@kodfabrik.com>"
        const person3 = ""
        expect(parser.splitPerson(person1).email).toBe("npm@npmjs.com")
        expect(parser.splitPerson(person1).url).toBe('')
        expect(parser.splitPerson(person1).fullname).toBe("npm")
        expect(parser.splitPerson(person2).email).toBe("azer@kodfabrik.com")
        expect(parser.splitPerson(person2).url).toBe('')
        expect(parser.splitPerson(person2).fullname).toBe("Azer Koçulu")
        expect(parser.splitPerson(person3).email).toBe('')
        expect(parser.splitPerson(person3).url).toBe('')
        expect(parser.splitPerson(person3).fullname).toBe('')
      })
})