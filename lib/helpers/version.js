import bumpFile from 'bump-file'
const SemVer = require('semver')

export const bumpVersion = (version, increment, identifier) => {
  return new Promise((resolve, reject) => {
    try {
      const bumpedVer = new SemVer(version)
        .inc(increment)
        .version

      return resolve(bumpedVer)
    } catch (e) {
      console.log(e)
      return reject(new Error(e))
    }
  })
}

export const bumpFileVersion = (file, options) => {
  return new Promise((resolve, reject) => {
    try {
      bumpFile(file, options)
        .then(resolve)
    } catch (e) {
      return reject(e)
    }
  })
}
