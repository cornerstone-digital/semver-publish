const path = require('path')
const { bumpFileVersion } = require('../helpers/version')
const filePath = path.join(process.cwd(), 'package.json')

const bumpAction = async (increment, options) => {
  const bumped = await bumpFileVersion(filePath, {
    increment,
    preId: options.identifier
  })

  console.log('Package bumped to', bumped.version)
}

module.exports = bumpAction
