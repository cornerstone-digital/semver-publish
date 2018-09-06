const simpleGit = require('simple-git/promise')
const logger = require('debug')('Semver-GitClient')

class GitClient {
  constructor (workingDir) {
    this.client = simpleGit(workingDir)
    this.remote = 'origin'
    this.branch = 'master'
    this.ignoreFiles = []
    this.dirtyFiles = []
  }

  addIgnoreFile (file) {
    this.ignoreFiles.push(file)
    logger(`${file} added to git ignored files`)

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
    await this.client.add(files)
    logger(files, 'added to git')

    return this
  }

  async commit (message) {
    await this.client.commit(message)
    logger('Commit successful:', message)

    return this
  }

  async addTag (tagName) {
    await this.client.addTag(tagName)
    logger('Tag created:', tagName)

    return this
  }

  async mergeFromTo (from, to) {
    await this.client.mergeFromTo(from, to)

    return this
  }

  async push () {
    await this.client.push(this.remote, this.branch)
    logger('Files pushed to:', `${this.remote}:${this.branch}`)

    return this
  }

  async pushTags () {
    await this.client.pushTags(this.remote)
    logger('Tags pushed to:', this.remote)

    return this
  }
}

module.exports = GitClient
