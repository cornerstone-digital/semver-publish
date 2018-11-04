const simpleGit = require('simple-git/promise')
const logger = require('debug')('Semver-GitClient')

class GitClient {
  constructor (workingDir) {
    this.client = simpleGit(workingDir)
    this.remote = 'origin'
    this.branch = 'master'
    this.dryRun = false
    this.ignoreFiles = []
    this.dirtyFiles = []
  }

  addIgnoreFile (file) {
    this.ignoreFiles.push(file)
    logger(`${file} added to git ignored files`)

    return this
  }

  setDryRun (value) {
    this.dryRun = value

    return this
  }

  setRemote (remoteName) {
    this.remote = remoteName
    logger(`Remote set to "${remoteName}"`)

    return this
  }

  setBranch (branchName) {
    this.branch = branchName
    logger(`Branch set to "${branchName}"`)

    return this
  }

  setNoVerify (value) {
    this.noVerify = value

    return this
  }

  async isRepo () {
    const validRepo = await this.client.checkIsRepo()

    if (!validRepo) {
      logger('Current working directory is not a valid Git repository')
      process.exit(1)
    }
  }

  async isDirty () {
    const status = await this.client.status()
    let dirty = false

    if (status['files'].length) {
      const changes = status['files'].filter(file => !this.ignoreFiles.includes(file.path))

      if (changes.length) {
        dirty = true
      }
    }

    if (status.ahead || status.behind) {
      dirty = true
    }

    if (dirty) {
      logger('Current working directory is dirty')
      logger(status)
      process.exit(1)
    }
  }

  async add (files) {
    if (this.dryRun) {
      logger('Dry Run:', files, 'added to git')

      return this
    }

    try {
      await this.client.add(files)
      logger(files, 'added to git')
    } catch (err) {
      logger('Failed to add files to git:', err)
      process.exit(1)
    }

    return this
  }

  async commit (message) {
    if (this.dryRun) {
      logger('Dry Run: Commit successful:', message)
      return this
    }

    try {
      let commitOptions = {}

      if (this.noVerify) {
        commitOptions = {
          ...commitOptions,
          '--no-verify': null
        }
      }

      await this.client.commit(message, null, commitOptions)

      logger('Commit successful:', message)
    } catch (err) {
      logger('Commit failed:', err)
      process.exit(1)
    }

    return this
  }

  async addTag (tagName) {
    if (this.dryRun) {
      logger('Dry Run: Tag created:', tagName)
      return this
    }

    try {
      await this.client.addTag(tagName)
      logger('Tag created:', tagName)
    } catch (err) {
      logger('Tag creation failed:', err)
      process.exit(1)
    }

    return this
  }

  async deleteTag(tagName) {
    if (this.dryRun) {
      logger('Dry Run: Tag deleted:', tagName)
      return this  
    }

    try {
      const tagOptions = [
        '--delete',
        `${tagName}`
      ]

      await this.client.tag(tagOptions)
      logger('Tag deleted:', tagName)
    } catch (err) {
      logger('Tag deletion failed:', err)
      process.exit(1)
    }

    return this
  }

  async mergeFromTo (from, to) {
    await this.client.mergeFromTo(from, to)

    return this
  }

  async push (remote, branch) {
    if (this.dryRun) {
      logger('Dry Run: Files pushed to:', `${remote}:${branch}`)
      return this
    }

    try {
      logger(`Pushing to ${branch}`)
      await this.client.push(remote, branch)
      logger('Files pushed to:', `${remote}:${branch}`)
    } catch (err) {
      logger('Push failed:', err)
      process.exit(1)
    }

    return this
  }

  async pushTags () {
    if (this.dryRun) {
      logger('Dry Run: Tags pushed to:', this.remote)
      return this
    }

    try {
      await this.client.pushTags(this.remote)
      logger('Tags pushed to:', this.remote)
    } catch (err) {
      logger('Failed to push tags:', err)
      process.exit(1)
    }

    return this
  }

  async tagExists (tagName) {
    const tags = await this.client.raw(command)
    console.log(tags)
  }
}

module.exports = GitClient
