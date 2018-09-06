const path = require('path')
const { bumpFileVersion } = require('../helpers/version')

const bumpAction = async (increment, options) => {
  const filePath = path.join(process.cwd(), options.root, 'package.json')
  const bumped = await bumpFileVersion(filePath, {
    increment,
    preId: options.identifier
  })

  console.log('Package bumped to', bumped.version)

  return bumped
}

module.exports = bumpAction
