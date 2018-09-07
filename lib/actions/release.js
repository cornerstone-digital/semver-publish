const shell = require('shelljs')
const GitClient = require('../helpers/git')
const bumpAction = require('../actions/bump')
const logger = require('debug')('Semver-Release')

const defaultOptions = {
  gitRoot: '.',
  increment: 'prerelease',
  identifier: 'next',
  remote: 'origin',
  libRoot: './lib',
  dryRun: false,
  publish: false,
  add: false,
  commit: false,
  tag: false
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

  const branch = await gitClient.client.branch()

  if (!releaseOptions.branch) {
    releaseOptions.branch = branch.current
  }

  logger('Current branch:', releaseOptions.branch)

  // Setup client
  gitClient
    .addIgnoreFile('package.json')
    .addIgnoreFile('.npmrc')
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
  await gitClient.isDirty()

  // Publish Package
  if (releaseOptions.publish) {
    logger(`Publishing ${bumped.version}`)

    let publishCommand = [`npm publish ${releaseOptions.libRoot}`]

    if (releaseOptions.identifier) {
      publishCommand.push(`--tag ${releaseOptions.identifier}`)
    }

    publishCommand = publishCommand.join(' ')

    if (!releaseOptions.dryRun) {
      const publish = await shell.exec(publishCommand)

      if (publish.code !== 0) {
        logger('Publishing failed: exiting')
        process.exit(1)
      }
    }

    logger(`${bumped.version} successfully published`)
  }

  // Add package.json to git
  if (releaseOptions.add) {
    await gitClient.add(['package.json'])
  }

  // Commit package.json
  if (releaseOptions.commit) {
    try {
      await gitClient.commit(`Bumped version to ${bumped.version}`)
      await shell.exec(`git commit -m "Bumped version to ${bumped.version}"`)
      await shell.exec(`git push ${gitClient.remote} ${gitClient.branch}`)
    } catch (err) {
      logger('Push failed:', err)
    }
    // await gitClient.push(gitClient.remote, gitClient.branch)
  }

  // Tag Repo
  if (releaseOptions.tag) {
    await gitClient.addTag(releaseOptions.identifier)
    await gitClient.addTag(bumped.version)
    await gitClient.pushTags()
  }
}

module.exports = releaseAction
