const simpleGit = require('simple-git')

const releaseAction = (workingDirPath, options) => {
  const gitClient = simpleGit(workingDirPath)

  console.log(gitClient)
}

module.exports = releaseAction
