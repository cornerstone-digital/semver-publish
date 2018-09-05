'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bumpFileVersion = exports.bumpVersion = undefined;

var _bumpFile = require('bump-file');

var _bumpFile2 = _interopRequireDefault(_bumpFile);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SemVer = require('semver');

var bumpVersion = exports.bumpVersion = function bumpVersion(version, increment, identifier) {
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

var bumpFileVersion = exports.bumpFileVersion = function bumpFileVersion(file, options) {
  return new Promise(function (resolve, reject) {
    try {
      (0, _bumpFile2.default)(file, options).then(resolve);
    } catch (e) {
      return reject(e);
    }
  });
};