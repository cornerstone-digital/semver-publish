const path = require('path')
const { bumpFileVersion } = require('../helpers/version')

const defaultOptions = {
  increment: 'prerelease',
  root: '.',
  identifier: ''
}

const bumpAction = async (options) => {
  const bumpOptions = Object.assign({}, defaultOptions, options)
  const filename = path.join(bumpOptions.root, 'package.json')
  const filePath = path.join(process.cwd(), filename)

  const bumped = await bumpFileVersion(filePath, {
    increment: bumpOptions.increment,
    preId: bumpOptions.identifier
  })

  console.log(filename, 'bumped to', bumped.version)

  return bumped
}

module.exports = bumpAction
