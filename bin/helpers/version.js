'use strict';

var bumpFile = require('bump-file');
var SemVer = require('semver');

module.exports.nextVersion = function (version, increment, identifier) {
  return new Promise(function (resolve, reject) {
    try {
      var bumpedVer = new SemVer(version).inc(increment).version;

      return resolve(bumpedVer);
    } catch (e) {
      console.log(e);
      return reject(new Error(e));
    }
  });
};

module.exports.bumpFileVersion = function (file, options) {
  return new Promise(function (resolve, reject) {
    try {
      bumpFile(file, options).then(resolve);
    } catch (e) {
      return reject(e);
    }
  });
};