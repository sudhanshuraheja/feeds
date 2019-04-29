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
})