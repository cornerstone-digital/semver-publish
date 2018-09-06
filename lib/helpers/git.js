const simpleGit = require('simple-git/promise')

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

    return this
  }

  setRemote (remoteName) {
    this.remote = remoteName

    return this
  }

  setBranch (branchName) {
    this.branch = branchName

    return this
  }

  async isRepo () {
    const validRepo = await this.client.checkIsRepo()

    if (!validRepo) {
      console.error('Current working directory is not a valid Git repository')
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
      console.error('Current working directory is dirty')
      console.log(status)
      process.exit(1)
    }
  }

  async add (files) {
    await this.client.add(files)

    return this
  }

  async commit (message) {
    await this.client.commit(message)

    return this
  }

  async addTag (tagName) {
    await this.client.addTag(tagName)

    return this
  }

  async mergeFromTo (from, to) {
    await this.client.mergeFromTo(from, to)

    return this
  }

  async push () {
    await this.client.push(this.remote, this.branch)

    return this
  }

  async pushTags () {
    await this.client.pushTags(this.remote)

    return this
  }
}

module.exports = GitClient
