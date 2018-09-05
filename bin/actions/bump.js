'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var path = require('path');

var _require = require('../helpers/version'),
    bumpFileVersion = _require.bumpFileVersion;

var filePath = path.join(process.cwd(), 'package.json');

var bumpAction = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(increment, options) {
    var bumped;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return bumpFileVersion(filePath, {
              increment: increment,
              preId: options.identifier
            });

          case 2:
            bumped = _context.sent;


            console.log('Package bumped to', bumped.version);

          case 4:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function bumpAction(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

module.exports = bumpAction;