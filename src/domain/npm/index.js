/* eslint-disable no-await-in-loop */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-underscore-dangle */
const _ = require('lodash')
const db = require('../../lib/npm')
const repo = require('./repo')
const log = require('../../lib/logger')
const parser = require('./parser')
const objects = require('../../lib/objects')

const logger = log.init('domain/npm')

// const fLogger = (item) => {
//   // eslint-disable-next-line no-console
//   console.log(JSON.stringify(item, null, 2))
// }

const npm = {
  parent: null,
  processed: 0,
  processMax: 5000000,
  startingCount: 0,

  start: (parent) => {
    npm.parent = parent
    db.init(npm.process, npm.startingCount)
  },

  process: async (data, done) => {

    const { seq, id, rev, doc, name, versions } = parser.home(data)
    logger.info(`${seq}:${id}`)

    await npm.processSequence(seq, id, rev)
    await npm.processPackage(name, rev, doc)
    await npm.processTags(name, doc)

    const keys = Object.keys(versions)
    for (const version in keys) {
      const item = versions[keys[version]]
      await npm.processVersion(item)
      await npm.processKeywords(name, keys[version], item)
      await npm.processDependencies(name, keys[version], item)
      await npm.processPeople(name, keys[version], item)
    }
    await npm.processTime(name, data.doc)
    
    npm.processed += 1
    if (npm.processed < npm.processMax) {
      done()
    } else {
      npm.parent.release()
    }
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
    try {
      const { repositoryType, repositoryURL, bugsURL, bugsEmail, githubOrg, githubRepo, licenceType, licenceURL, usersCount, readme, description } = parser.package(doc)
      await repo.packages.insert(name, rev, description, readme, doc.time.modified, doc.time.created, repositoryType, repositoryURL, githubOrg, githubRepo, doc.readmeFileName, doc.homepage, bugsURL, bugsEmail, licenceType, licenceURL, usersCount)
    } catch(err) {
      logger.error(err)
      npm.parent.release()
    }
  },

  processTags: async (name, doc) => {
    const { tags } = parser.tags(doc)
    const keys = Object.keys(tags)
    for (const i in keys) {
      try {
        const key = keys[i]
        const tag = tags[key]
        await repo.tags.insert(name, key, tag)
      } catch(err) {
        logger.error(err)
        npm.parent.release()  
      }
    }
  },

  processVersion: async (details) => {
    try {
      const { repositoryType, repositoryURL, bugsURL, bugsEmail, githubOrg, githubRepo, licenceType, licenceURL, committerName, committerEmail } = parser.version(details)
      // eslint-disable-next-line no-underscore-dangle
      await repo.versions.insert(details._id, details.name, details.version, details.description, details.homepage, repositoryType, repositoryURL, githubOrg, githubRepo, bugsURL, bugsEmail, licenceType, licenceURL, committerName, committerEmail, details.npmVersion, details.nodeVersion, details.distShasum, details.distTarball, details.deprecated)
    } catch(err) {
      logger.error(err)
      npm.parent.release()
    }
  },

  processKeywords: async (name, version, versionDetails) => {
    const keys = []
    const { keywords } = versionDetails
    if (objects.isArray(keywords)) {
      for (const k in keywords) {
        try {
          const key = keywords[k]
          if(key !== '' && !keys.includes(key)) {
            keys.push(key)
            await repo.keywords.insert(name, version, key)
          }
        } catch(err) {
          logger.error(err)
          npm.parent.release()
        }
      }
    }
  },

  processDependencies: async (name, version, versionDetails) => {
    const {dependencies, devDependencies, optionalDependencies, bundleDependencies} = versionDetails
    if (objects.isObject(dependencies)) {
      const keys = Object.keys(dependencies)
      for (const i in keys) {
        try {
          const key = keys[i]
          const dependency = dependencies[key]
          await repo.dependencies.insert(name, version, key, dependency, '', 'dep')
        } catch(err) {
          logger.error(err)
          npm.parent.release()
        }
      }
    }

    if (objects.isObject(devDependencies)) {
      const keys = Object.keys(devDependencies)
      for (const i in keys) {
        try {
          const key = keys[i]
          const dependency = devDependencies[key]
          await repo.dependencies.insert(name, version, key, dependency, '', 'dev')
        } catch(err) {
          logger.error(err)
          npm.parent.release()
        }
      }
    }

    if (objects.isObject(optionalDependencies)) {
      const keys = Object.keys(optionalDependencies)
      for (const i in keys) {
        try {
          const key = keys[i]
          const dependency = optionalDependencies[key]
          await repo.dependencies.insert(name, version, key, dependency, '', 'optional')
        } catch(err) {
          logger.error(err)
          npm.parent.release()
        }
      }
    }

    if (objects.isArray(bundleDependencies)) {
      for (const i in bundleDependencies) {
        try {
          const dep = bundleDependencies[i]
          await repo.dependencies.insert(name, version, dep, '', '', 'bundle')
        } catch(err) {
          logger.error(err)
          npm.parent.release()
        }
      }
    }
  },

  processPeople: async (name, version, versionDetails) => {
    const {author, maintainers, contributors} = versionDetails
    try {
      const { fullname, email, url } = parser.splitPerson(author)
      if (fullname || email || url) {
        await repo.people.insert(name, version, email, fullname, url, 'author')
      }
    } catch(err) {
      logger.error(err)
      npm.parent.release()
    }

    if (objects.isArray(maintainers)) {
      for (const i in maintainers) {
        try {
          const person = maintainers[i]
          const { fullname, email, url } = parser.splitPerson(person)
          if (fullname || email || url) {
            await repo.people.insert(name, version, email, fullname, url, 'maintainer')
          }
        } catch(err) {
          logger.error(err)
          npm.parent.release()
        }
      }
    }

    const contribs = []
    if(objects.isArray(contributors)) {
      for (const i in contributors) {
        try {
          const person = contributors[i]
          const { fullname, email, url } = parser.splitPerson(person)
          if (fullname || email || url) {
            if (!_.find(contribs, { fullname, email, url })) {
              contribs.push({ fullname, email, url })
              await repo.people.insert(name, version, email, fullname, url, 'contributor')
            } else {
              logger.error(`Already contains ${name}/${version}: ${fullname}, ${email}, ${url}`)
            }
          }
        } catch(err) {
          logger.error(err)
          npm.parent.release()
        }
      }
    }
  },

  processTime: async (name, doc) => {
    const {time} = doc
    const keys = Object.keys(time)
    for (const i in keys) {
      const version = keys[i]
      const ignore = ['modified', 'created']
      if(!ignore.includes(version)) {
        try {
          await repo.times.insert(name, version, time[version])
        } catch(err) {
          logger.error(err)
          npm.parent.release()
        }
      }
    }
  }

}

module.exports = npm