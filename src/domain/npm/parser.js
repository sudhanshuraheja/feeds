const Iterator = require('../../lib/iterator')

const parser = {
    home: (data) => {
        const dataI = new Iterator(data)

        const seq = dataI.$('seq', true)
        const id = dataI.$('id', true)
        const rev = dataI.$('changes').$(0).$('rev', true)
    
        const docI = dataI.$('doc')
        const doc = docI.value()
        const name = docI.$('_id', true)
        const versions = docI.$('versions', true)
    
        return { seq, id, rev, doc, name, versions }
    },

    package: (data) => {
        const docI = new Iterator(data)
        const repositoryType = docI.$('repository').$('type', true)
        const repositoryURL = docI.$('repository').$('url', true)
        const bugsURL = docI.$('bugs').$('url', true)
        const bugsEmail = docI.$('bugs').$('email', true)
        const {githubOrg, githubRepo} = parser.splitGithubURL(docI.$('repository').$('url', true))
        const {licenceType, licenceURL} = parser.splitLicense(docI.$('license', true) || docI.$('licenses', true))
        const usersCount = docI.$('users').keys().length
        const readme = docI.$('readme').string().replace(/\0/g, '')
        const description = docI.$('description').string().replace(/\0/g, '')

        return { repositoryType, repositoryURL, bugsURL, bugsEmail, githubOrg, githubRepo, licenceType, licenceURL, usersCount, readme, description }
    },

    version: (data) => {
        const docI = new Iterator(data)
        const repositoryType = docI.$('repository').$('type', true)
        const repositoryURL = docI.$('repository').$('url', true)
        const bugsURL = docI.$('bugs').$('url', true)
        const bugsEmail = docI.$('bugs').$('email', true)
        const {githubOrg, githubRepo} = parser.splitGithubURL(docI.$('repository').$('url', true))
        const {licenceType, licenceURL} = parser.splitLicense(docI.$('license', true) || docI.$('licenses', true))
        const committerName = docI.$('_npmUser').$('name', true)
        const committerEmail = docI.$('_npmUser').$('email', true)

        return { repositoryType, repositoryURL, bugsURL, bugsEmail, githubOrg, githubRepo, licenceType, licenceURL, committerName, committerEmail }
    },

    splitPerson: (author) => {
        const person = { fullname: '', email: '', url: '' }
        if (typeof author === 'object') {
          person.fullname = author.name ? author.name : ''
          person.email = author.email ? author.email : ''
          person.url = author.url ? author.url : ''
        } else if(typeof author === 'string' && author.length > 0) {
          [person.fullname, person.email] = author.split('<')
          if (person.email) {
            person.email = person.email.replace('>', '').trim()
          }
          person.fullname = person.fullname.trim()
        }
        return person
      },
    
      splitGithubURL: (url) => {
        const git = { githubOrg: undefined, githubRepo: undefined }
        if (url) {
          const split = url.split('/')
          if (split[split.length - 2] && split[split.length - 1].replace('.git', '')) {
            git.githubOrg = split[split.length - 2]
            const repoURL = split[split.length - 1];
            [ git.githubRepo ]  = repoURL.split('.git')
          }
        }
        return git
      },
    
      splitLicense: (license) => {
        const info = { licenceType: undefined, licenceURL: undefined }
        if (Array.isArray(license)) {
          if (license && license[0] && license[0].type) {
            info.licenceType = license[0].type
            info.licenceURL = license[0].url  
          }
        } else if (typeof license === 'object') {
          info.licenceType = license.type
          info.licenceURL = license.url
        } else if (typeof license === 'string') {
          if (license !== '') {
            info.licenceType = license
          }
        }
        return info
      }
}

module.exports = parser