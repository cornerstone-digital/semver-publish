const GitClient = require('../helpers/git')
const bumpAction = require('../actions/bump')
const logger = require('debug')('Semver-Release')

const defaultOptions = {
  gitRoot: '.',
  increment: 'prerelease',
  identifier: 'next',
  remote: 'origin',
  branch: 'master',
  libRoot: './lib',
  dryRun: false,
  tag: true,
  commit: true
}

const releaseAction = async (options) => {
  const releaseOptions = Object.assign({}, defaultOptions, options)

  if (releaseOptions.dryRun) {
    logger('*******************************************')
    logger(`* DRY RUN MODE ENABLED`)
    logger('* No changes will be applied')
    logger('*******************************************')
    logger('')
  }

  // console.log(releaseOptions)
  const gitClient = new GitClient(releaseOptions.gitRoot)

  // Setup client
  gitClient
    .addIgnoreFile('package.json')
    .setDryRun(releaseOptions.dryRun)
    .setRemote(releaseOptions.remote)
    .setBranch(releaseOptions.branch)

  // Check is current working directory is a valid git repository
  await gitClient.isRepo()

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

  // Check only expected changes are present (ignoring excluded files)
  // await gitClient.isDirty()

  // Publish Package

  // Commit package.json
  if (releaseOptions.commit) {
    await gitClient.add(['package.json'])
    await gitClient.commit(`Bumped version to ${bumped.version}`)
    await gitClient.push(releaseOptions.remote, releaseOptions.branch)
  }

  // Tag Repo
  if (releaseOptions.tag) {
    await gitClient.addTag(bumped.version)
    await gitClient.pushTags()
  }
}

module.exports = releaseAction
