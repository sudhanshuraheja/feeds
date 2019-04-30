const repo = require('./')

describe('Domain NPM', () => {
  test('Check github url and repo', () => {
    expect(repo.splitGithubURL("git+https://github.com/axios/axios1.git").githubOrg).toBe('axios')
    expect(repo.splitGithubURL("git+https://github.com/axios/axios1.git").githubRepo).toBe('axios1')
    expect(repo.splitGithubURL("git://github.com/axios/axios1.git").githubOrg).toBe('axios')
    expect(repo.splitGithubURL("git://github.com/axios/axios1.git").githubRepo).toBe('axios1')
    expect(repo.splitGithubURL("https://github.com/axios/axios1.git").githubOrg).toBe('axios')
    expect(repo.splitGithubURL("https://github.com/axios/axios1.git").githubRepo).toBe('axios1')
    expect(repo.splitGithubURL("https://github.com/axios/axios1").githubOrg).toBe('axios')
    expect(repo.splitGithubURL("https://github.com/axios/axios1").githubRepo).toBe('axios1')
  })

  test('Check licences', () => {
    const license1 = "MIT"
    const license2 = "Apache, Version 2.0"
    const licenses1 = [{ "type": "MIT", "url": "http://lodash.com/license" }]
    const licenses2 = [{ "type": "MIT +no-false-attribs", "url": "https://github.com/isaacs/npm/raw/master/LICENSE" }]

    expect(repo.splitLicense(license1, undefined).licenceType).toBe("MIT")
    expect(repo.splitLicense(license1, undefined).licenceURL).toBe(undefined)
    expect(repo.splitLicense(license2, undefined).licenceType).toBe("Apache, Version 2.0")
    expect(repo.splitLicense(license2, undefined).licenceURL).toBe(undefined)
    expect(repo.splitLicense(undefined, licenses1).licenceType).toBe("MIT")
    expect(repo.splitLicense(undefined, licenses1).licenceURL).toBe("http://lodash.com/license")
    expect(repo.splitLicense(undefined, licenses2).licenceType).toBe("MIT +no-false-attribs")
    expect(repo.splitLicense(undefined, licenses2).licenceURL).toBe("https://github.com/isaacs/npm/raw/master/LICENSE")
  })

  test('Check split person', () => {
    const person1 = { "name": "npm", "email": "npm@npmjs.com" }
    const person2 = "Azer Koçulu <azer@kodfabrik.com>"
    const person3 = ""
    expect(repo.splitPerson(person1).email).toBe("npm@npmjs.com")
    expect(repo.splitPerson(person1).url).toBe('')
    expect(repo.splitPerson(person1).fullname).toBe("npm")
    expect(repo.splitPerson(person2).email).toBe("azer@kodfabrik.com")
    expect(repo.splitPerson(person2).url).toBe('')
    expect(repo.splitPerson(person2).fullname).toBe("Azer Koçulu")
    expect(repo.splitPerson(person3).email).toBe('')
    expect(repo.splitPerson(person3).url).toBe('')
    expect(repo.splitPerson(person3).fullname).toBe('')
  })
})