/* eslint-disable no-underscore-dangle */
const db = require('../../lib/npm')
const repo = require('./repo')
const logger = require('../../lib/logger')('domain/npm')

const fLogger = (item) => {
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(item, null, 2))
}

const npm = {
  parent: null,

  start: (parent) => {
    npm.parent = parent
    db.init(npm.process, 0)
  },

  process: (data, done) => {
    fLogger(data)

    // sequence
    npm.processSequence(data.seq, data.id, data.changes[0].rev)

    // -- package --
    const name = data.doc._id
    npm.processPackage(name, data.doc._rev, data.doc)
    npm.processTags(name, data.doc)

    const {versions} = data.doc
    Object.keys(versions).forEach((version) => {
      npm.processVersion(versions[version])
      npm.processKeywords(name, version, versions[version])
      npm.processDependencies(name, version, versions[version])
      npm.processPeople(name, version, versions[version])
    })
    npm.processTime(name, data.doc)
    
    // logger.info(data)
    // done()
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
      await repo.packages.insert(name, rev, doc.description, doc.readme, doc.time.modified, doc.time.created, doc.repositoryType, doc.repositoryURL, doc.repositoryGithubOrg, doc.repositoryGithubRepo, doc.readmeFileName, doc.homepage, doc.bugsURL, doc.bugsEmail, doc.licenceType, doc.licenceURL, doc.users)
    } catch(err) {
      logger.error(err)
      npm.parent.release()
    }
  },

  processTags: (name, doc) => {
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
      // eslint-disable-next-line no-underscore-dangle
      await repo.versions.insert(details._id, details.name, details.version, details.description, details.homepage, details.repositoryType, details.repositoryURL, details.repositoryGithubOrg, details.repositoryGithubRepo, details.bugsURL, details.bugsEmail, details.licenceType, details.licenseURL, details.committerName, details.committerEmail, details.npmVersion, details.nodeVersion, details.distShasum, details.distTarball, details.deprecated)
    } catch(err) {
      logger.error(err)
      npm.parent.release()
    }
  },

  processKeywords: (name, version, versionDetails) => {
    const {keywords} = versionDetails
    Object.keys(keywords).forEach(async k => {
      try {
        await repo.keywords.insert(name, version, k.keyword)
      } catch(err) {
        logger.error(err)
        npm.parent.release()
      }
    })
  },

  processDependencies: (name, version, versionDetails) => {
    const {dependencies, devDependencies, optionalDependencies, bundleDependencies} = versionDetails
    Object.keys(dependencies).forEach(async dep => {
      try {
        await repo.dependencies.insert(name, version, dep, dependencies[dep], '', 'dep')
      } catch(err) {
        logger.error(err)
        npm.parent.release()
      }
    })
    Object.keys(devDependencies).forEach(async dep => {
      try {
        await repo.dependencies.insert(name, version, dep, dependencies[dep], '', 'dev')
      } catch(err) {
        logger.error(err)
        npm.parent.release()
      }
    })
    Object.keys(optionalDependencies).forEach(async dep => {
      try {
        await repo.dependencies.insert(name, version, dep, dependencies[dep], '', 'optional')
      } catch(err) {
        logger.error(err)
        npm.parent.release()
      }
    })
    bundleDependencies.forEach(async dep => {
      try {
        await repo.dependencies.insert(name, version, dep, '', '', 'bundle')
      } catch(err) {
        logger.error(err)
        npm.parent.release()
      }
    })
  },

  processPeople: async (name, version, versionDetails) => {
    const {author, maintainers, contributors} = versionDetails
    try {
      await repo.people.insert(name, version, author.email, author.name, author.url, 'author')
    } catch(err) {
      logger.error(err)
      npm.parent.release()
    }

    maintainers.forEach(async person => {
      try {
        await repo.people.insert(name, version, person.email, person.name, person.url, 'maintainer')
      } catch(err) {
        logger.error(err)
        npm.parent.release()
      }
    })
    contributors.forEach(async person => {
      try {
        await repo.people.insert(name, version, person.email, person.name, person.url, 'contributor')
      } catch(err) {
        logger.error(err)
        npm.parent.release()
      }
    })
  },

  processTime: (name, doc) => {
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

  }

}

module.exports = npm