const GitClient = require('../helpers/git')
// const { bumpFileVersion } = require('../helpers/version')

const releaseAction = async (workingDirPath, options) => {
  const gitClient = new GitClient(workingDirPath)

  // Check is current working directory is a valid git repository
  await gitClient.isRepo()

  gitClient.addIgnoreFile('package.json')
  // Check if the current git directory is dirty
  await gitClient.isDirty()

  // Bump the package.json version

  // Publish Package

  // Tag Repo

  // Push changes to Git
}

module.exports = releaseAction
