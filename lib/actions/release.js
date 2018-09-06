const GitClient = require('../helpers/git')
const bumpAction = require('../actions/bump')

const defaultOptions = {
  gitRoot: '.',
  increment: 'prerelease',
  identifier: 'next',
  remote: 'origin',
  branch: 'master',
  libRoot: './lib'
}

const releaseAction = async (options) => {
  const releaseOptions = Object.assign({}, defaultOptions, options)

  // console.log(releaseOptions)
  const gitClient = new GitClient(releaseOptions.gitRoot)

  // Setup client
  gitClient
    .addIgnoreFile('package.json')
    .setRemote(releaseOptions.remote)
    .setBranch(releaseOptions.branch)

  // Check is current working directory is a valid git repository
  await gitClient.isRepo()

  // // Check if the current git directory is dirty (minus ignored files)
  // // await gitClient.isDirty()

  // Bump the version
  await bumpAction({
    increment: releaseOptions.increment,
    identifier: releaseOptions.identifier
  })

  const bumped = await bumpAction({
    increment: releaseOptions.increment,
    identifier: releaseOptions.identifier,
    root: releaseOptions.libRoot
  })

  // Publish Package

  // Commit package.json
  await gitClient.add('package.json')
  await gitClient.commit('Bumped version to', bumped.version)
  await gitClient.push(releaseOptions.remote, releaseOptions.branch)

  // Tag Repo
  await gitClient.addTag(bumped.version)
  await gitClient.pushTags()

  const status = gitClient.getStatus()

  console.log(status)

  // Push changes to Git
}

module.exports = releaseAction
