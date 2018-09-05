const path = require('path')
const { bumpFileVersion } = require('../helpers/version')
const filePath = path.join(process.cwd(), 'package.json')

const bumpAction = (increment, options) => {
  return bumpFileVersion(filePath, {
    increment,
    preId: options.identifier
  }).then(bumped => {
    console.log('Package bumped to', bumped.version)

    return bumped
  })
}

module.exports = bumpAction
