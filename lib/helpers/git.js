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
      await this.client.add(files)

      return this
    }

    logger(files, 'added to git')
    await this.client.add(files)

    return this
  }

  async commit (message) {
    if (this.dryRun) {
      logger('Dry Run: Commit successful:', message)
      return this
    }

    await this.client.commit(message)
    logger('Commit successful:', message)

    return this
  }

  async addTag (tagName) {
    if (this.dryRun) {
      logger('Dry Run: Tag created:', tagName)
      return this
    }

    await this.client.addTag(tagName)
    logger('Tag created:', tagName)

    return this
  }

  async mergeFromTo (from, to) {
    await this.client.mergeFromTo(from, to)

    return this
  }

  async push () {
    if (this.dryRun) {
      logger('Dry Run: Files pushed to:', `${this.remote}:${this.branch}`)
      return this
    }

    await this.client.push(this.remote, this.branch)
    logger('Files pushed to:', `${this.remote}:${this.branch}`)

    return this
  }

  async pushTags () {
    if (this.dryRun) {
      logger('Dry Run: Tags pushed to:', this.remote)
      return this
    }

    await this.client.pushTags(this.remote)
    logger('Tags pushed to:', this.remote)

    return this
  }
}

module.exports = GitClient
