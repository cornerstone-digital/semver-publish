'use strict';

var path = require('path');

var _require = require('../helpers/version'),
    bumpFileVersion = _require.bumpFileVersion;

var filePath = path.join(process.cwd(), 'package.json');

var bumpAction = function bumpAction(increment, options) {
  return bumpFileVersion(filePath, {
    increment: increment,
    preId: options.identifier
  }).then(function (bumped) {
    console.log('Package bumped to', bumped.version);

    return bumped;
  });
};

module.exports = bumpAction;