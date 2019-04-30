/* eslint-disable no-underscore-dangle */
const db = require('../../lib/npm')
const repo = require('./repo')
const log = require('../../lib/logger')

const logger = log.init('domain/npm')

const fLogger = (item) => {
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(item, null, 2))
}

const npm = {
  parent: null,
  processed: 0,
  processMax: 1000,

  start: (parent) => {
    npm.parent = parent
    db.init(npm.process, 0)
  },

  process: async (data, done) => {
    fLogger(data)

    // sequence
    await npm.processSequence(data.seq, data.id, data.changes[0].rev)

    // -- package --
    const name = data.doc._id
    await npm.processPackage(name, data.doc._rev, data.doc)
    await npm.processTags(name, data.doc)

    const {versions} = data.doc
    Object.keys(versions).forEach(async version => {
      await npm.processVersion(versions[version])
      await npm.processKeywords(name, version, versions[version])
      await npm.processDependencies(name, version, versions[version])
      await npm.processPeople(name, version, versions[version])
    })
    await npm.processTime(name, data.doc)
    
    npm.processed += 1
    if (npm.processed < npm.processMax) {
      done()
    } else {
      npm.parent.release()
    }
    // logger.info(data)
  },

  processSequence: async (seq, id, rev) => {
    try {
      await repo.sequence.insert(seq, id, rev)
    } catch(err) {
      logger.error(err)
      npm.parent.release()
    }
  },

  processPackage: async (name, rev, doc) => {
    const repositoryType = (doc.repository && doc.repository.type && doc.repository.type.length > 0) ? doc.repository.type : undefined
    const repositoryURL = (doc.repository && doc.repository.url && doc.repository.url.length > 0) ? doc.repository.url : undefined
    const bugsURL = doc.bugs ? doc.bugs.url : undefined
    const bugsEmail = doc.bugs ? doc.bugs.email : undefined
    const {githubOrg, githubRepo} = npm.splitGithubURL(doc.repository ? doc.repository.url : undefined)
    const {licenceType, licenceURL} = npm.splitLicense(doc.license, doc.licenses)
    const usersCount = doc.users ? Object.keys(doc.users).length : 0
    try {
      await repo.packages.insert(name, rev, doc.description, doc.readme, doc.time.modified, doc.time.created, repositoryType, repositoryURL, githubOrg, githubRepo, doc.readmeFileName, doc.homepage, bugsURL, bugsEmail, licenceType, licenceURL, usersCount)
    } catch(err) {
      logger.error(err)
      npm.parent.release()
    }
  },

  processTags: async (name, doc) => {
    const tags = doc['dist-tags']
    Object.keys(tags).forEach(async tag => {
      try {
        await repo.tags.insert(name, tag, tags[tag])
      } catch(err) {
        logger.error(err)
        npm.parent.release()  
      }
    })
  },

  processVersion: async (details) => {
    try {
      const repositoryType = (details.repository && details.repository.type && details.repository.type.length > 0) ? details.repository.type : undefined
      const repositoryURL = (details.repository && details.repository.url && details.repository.url.length > 0) ? details.repository.url : undefined
      const bugsURL = details.bugs ? details.bugs.url : undefined
      const bugsEmail = details.bugs ? details.bugs.email : undefined
      const {githubOrg, githubRepo} = npm.splitGithubURL(details.repository ? details.repository.url : undefined)
      const {licenceType, licenceURL} = npm.splitLicense(details.license, details.licenses)
      const committerName = details._npmUser ? details._npmUser.name : undefined
      const committerEmail = details._npmUser ? details._npmUser.email : undefined
      // eslint-disable-next-line no-underscore-dangle
      await repo.versions.insert(details._id, details.name, details.version, details.description, details.homepage, repositoryType, repositoryURL, githubOrg, githubRepo, bugsURL, bugsEmail, licenceType, licenceURL, committerName, committerEmail, details.npmVersion, details.nodeVersion, details.distShasum, details.distTarball, details.deprecated)
    } catch(err) {
      logger.error(err)
      npm.parent.release()
    }
  },

  processKeywords: async (name, version, versionDetails) => {
    const {keywords} = versionDetails
    if (keywords) {
      keywords.forEach(async k => {
        try {
          if(k && k.keyword) {
            await repo.keywords.insert(name, version, k.keyword)
          }
        } catch(err) {
          logger.error(err)
          npm.parent.release()
        }
      })  
    }
  },

  processDependencies: async (name, version, versionDetails) => {
    const {dependencies, devDependencies, optionalDependencies, bundleDependencies} = versionDetails
    if (dependencies) {
      Object.keys(dependencies).forEach(async dep => {
        try {
          await repo.dependencies.insert(name, version, dep, dependencies[dep], '', 'dep')
        } catch(err) {
          logger.error(err)
          npm.parent.release()
        }
      })  
    }

    if (devDependencies) {
      Object.keys(devDependencies).forEach(async dep => {
        try {
          await repo.dependencies.insert(name, version, dep, devDependencies[dep], '', 'dev')
        } catch(err) {
          logger.error(err)
          npm.parent.release()
        }
      })  
    }

    if (optionalDependencies) {
      Object.keys(optionalDependencies).forEach(async dep => {
        try {
          await repo.dependencies.insert(name, version, dep, optionalDependencies[dep], '', 'optional')
        } catch(err) {
          logger.error(err)
          npm.parent.release()
        }
      })  
    }

    if (bundleDependencies) {
      bundleDependencies.forEach(async dep => {
        try {
          await repo.dependencies.insert(name, version, dep, '', '', 'bundle')
        } catch(err) {
          logger.error(err)
          npm.parent.release()
        }
      })  
    }
  },

  processPeople: async (name, version, versionDetails) => {
    const {author, maintainers, contributors} = versionDetails
    try {
      const { fullname, email, url } = npm.splitPerson(author)
      if (fullname || email || url) {
        await repo.people.insert(name, version, email, fullname, url, 'author')
      }
    } catch(err) {
      logger.error(err)
      npm.parent.release()
    }

    if (maintainers) {
      maintainers.forEach(async person => {
        try {
          const { fullname, email, url } = npm.splitPerson(person)
          if (fullname || email || url) {
            await repo.people.insert(name, version, email, fullname, url, 'maintainer')
          }
        } catch(err) {
          logger.error(err)
          npm.parent.release()
        }
      })  
    }

    if(contributors) {
      contributors.forEach(async person => {
        try {
          const { fullname, email, url } = npm.splitPerson(person)
          if (fullname || email || url) {
            await repo.people.insert(name, version, email, fullname, url, 'contributor')
          }
        } catch(err) {
          logger.error(err)
          npm.parent.release()
        }
      })  
    }
  },

  processTime: async (name, doc) => {
    const {time} = doc
    Object.keys(time).forEach(async (version) => {
      const ignore = ['modified', 'created']
      if(!ignore.includes(version)) {
        try {
          await repo.times.insert(name, version, time[version])
        } catch(err) {
          logger.error(err)
          npm.parent.release()
        }
      }
    })
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
        git.githubRepo = split[split.length - 1].replace('.git', '')  
      }
    }
    return git
  },

  splitLicense: (license, licenses) => {
    const info = { licenceType: undefined, licenceURL: undefined }
    if (license) {
      info.licenceType = license
    } else if (licenses && licenses[0] && licenses[0].type) {
      info.licenceType = licenses[0].type
      info.licenceURL = licenses[0].url
    }
    return info
  }

}

module.exports = npm