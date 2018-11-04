const shell = require('shelljs')
const GitClient = require('../helpers/git')
const bumpAction = require('../actions/bump')
const logger = require('debug')('Semver-Release')

const defaultOptions = {
  gitRoot: process.env.RELEASE_GIT_ROOT || '.',
  increment: process.env.RELEASE_INCREMENT || 'prerelease',
  identifier: process.env.RELEASE_IDENTIFIER || 'next',
  remote: process.env.RELEASE_GIT_REMOTE || 'origin',
  branch: process.env.RELEASE_GIT_BRANCH || 'development',
  libRoot: process.env.RELEASE_LIB_ROOT || './lib',
  dryRun: process.env.RELEASE_DRY_RUN || false,
  publish: process.env.RELEASE_NPM_PUBLISH || false,
  add: process.env.RELEASE_GIT_ADD || false,
  commit: process.env.RELEASE_GIT_COMMIT || false,
  tag: process.env.RELEASE_GIT_TAG || false,
  npmTag: process.env.RELEASE_NPM_TAG || 'latest'
  noVerify: process.env.RELEASE_GIT_NO_VERIFY || false
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

  if (releaseOptions.addIgnore) {
    const ignoreArr = releaseOptions.addIgnore.split(',')

    if (Array.isArray(ignoreArr)) {
      ignoreArr.forEach(file => gitClient.addIgnoreFile(file))
    }
  }

  // Setup client
  gitClient
    .addIgnoreFile('package.json')
    .addIgnoreFile('.npmrc')
    .setDryRun(releaseOptions.dryRun)
    .setRemote(releaseOptions.remote)
    .setBranch(releaseOptions.branch)
    .setNoVerify(releaseOptions.noVerify)

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

    if (releaseOptions.npmTag) {
      publishCommand.push(`--tag ${releaseOptions.npmTag}`)
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
      await gitClient.commit(`Bumped version to ${bumped.version} ***NO_CI***`)
      await gitClient.push(gitClient.remote, `HEAD:${gitClient.branch}`)
    } catch (err) {
      logger('Push failed:', err)
    }
  }

  // Tag Repo
  if (releaseOptions.tag) {
    if (releaseOptions.npmTag) {
      await gitClient.deleteTag(releaseOptions.npmTag)
      await gitClient.addTag(releaseOptions.npmTag)
    }
    
    await gitClient.addTag(bumped.version)
    await gitClient.pushTags()
  }
}

module.exports = releaseAction
