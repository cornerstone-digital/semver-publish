const simpleGit = require('simple-git/promise')

class GitClient {
  constructor (workingDir) {
    this.client = simpleGit(workingDir)
    this.ignoreFiles = []
  }

  addIgnoreFile (file) {
    this.ignoreFiles.push(file)

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

    const types = [
      'not_added',
      'conflicted',
      'created',
      'deleted',
      'modified',
      'renamed'
    ]

    types.forEach(type => {
      if (status[type].length) {
        const changes = status[type].filter(file => !this.ignoreFiles.includes(file))
        console.log(changes)

        if (changes.length) {
          dirty = true
        }
      }
    })

    // if (status.staged.length || status.files.length || status.ahead || status.behind) {
    //   dirty = true
    // }

    if (dirty) {
      console.error('Current working directory is dirty')
      process.exit(1)
    }
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

  async push (remote, branch) {
    await this.client.push(remote, branch)

    return this
  }

  async pushTags (remote) {
    await this.client.pushTags(remote)

    return this
  }
}

module.exports = GitClient
