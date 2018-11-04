const path = require('path')
const { bumpFileVersion } = require('../helpers/version')
const logger = require('debug')('Semver-Bump')

const defaultOptions = {
  increment: 'prerelease',
  root: '.',
  identifier: ''
}

const bumpAction = async (options) => {
  console.log(options)
  const bumpOptions = Object.assign({}, defaultOptions, options)
  const filename = path.join(bumpOptions.root, 'package.json')
  const filePath = path.join(process.cwd(), filename)

  const bumped = await bumpFileVersion(filePath, {
    increment: bumpOptions.increment
  })

  logger(filename, 'bumped to', bumped.version)

  return bumped
}

module.exports = bumpAction
