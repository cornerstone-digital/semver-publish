'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var path = require('path');

var _require = require('../helpers/version'),
    bumpFileVersion = _require.bumpFileVersion;

var logger = require('debug')('Semver-Bump');

var defaultOptions = {
  increment: 'prerelease',
  root: '.',
  identifier: 'next'
};

var bumpAction = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(options) {
    var bumpOptions, filename, filePath, bumped;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            bumpOptions = Object.assign({}, defaultOptions, options);
            filename = path.join(bumpOptions.root, 'package.json');
            filePath = path.join(process.cwd(), filename);
            _context.next = 5;
            return bumpFileVersion(filePath, {
              increment: bumpOptions.increment,
              preId: bumpOptions.identifier
            });

          case 5:
            bumped = _context.sent;


            logger(filename, 'bumped to', bumped.version);

            return _context.abrupt('return', bumped);

          case 8:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function bumpAction(_x) {
    return _ref.apply(this, arguments);
  };
}();

module.exports = bumpAction;