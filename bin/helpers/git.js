'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var simpleGit = require('simple-git/promise');
var logger = require('debug')('Semver-GitClient');

var GitClient = function () {
  function GitClient(workingDir) {
    _classCallCheck(this, GitClient);

    this.client = simpleGit(workingDir);
    this.remote = 'origin';
    this.branch = 'master';
    this.dryRun = false;
    this.ignoreFiles = [];
    this.dirtyFiles = [];
  }

  _createClass(GitClient, [{
    key: 'addIgnoreFile',
    value: function addIgnoreFile(file) {
      this.ignoreFiles.push(file);
      logger(file + ' added to git ignored files');

      return this;
    }
  }, {
    key: 'setDryRun',
    value: function setDryRun(value) {
      this.dryRun = value;

      return this;
    }
  }, {
    key: 'setRemote',
    value: function setRemote(remoteName) {
      this.remote = remoteName;
      logger('Remote set to "' + remoteName + '"');

      return this;
    }
  }, {
    key: 'setBranch',
    value: function setBranch(branchName) {
      this.branch = branchName;
      logger('Branch set to "' + branchName + '"');

      return this;
    }
  }, {
    key: 'setNoVerify',
    value: function setNoVerify(value) {
      this.noVerify = value;

      return this;
    }
  }, {
    key: 'isRepo',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var validRepo;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.client.checkIsRepo();

              case 2:
                validRepo = _context.sent;


                if (!validRepo) {
                  logger('Current working directory is not a valid Git repository');
                  process.exit(1);
                }

              case 4:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function isRepo() {
        return _ref.apply(this, arguments);
      }

      return isRepo;
    }()
  }, {
    key: 'isDirty',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var _this = this;

        var status, dirty, changes;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.client.status();

              case 2:
                status = _context2.sent;
                dirty = false;


                if (status['files'].length) {
                  changes = status['files'].filter(function (file) {
                    return !_this.ignoreFiles.includes(file.path);
                  });


                  console.log(changes);
                  if (changes.length) {
                    dirty = true;
                  }
                }

                if (status.ahead || status.behind) {
                  dirty = true;
                }

                if (dirty) {
                  logger('Current working directory is dirty');
                  logger(status);
                  process.exit(1);
                }

              case 7:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function isDirty() {
        return _ref2.apply(this, arguments);
      }

      return isDirty;
    }()
  }, {
    key: 'add',
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(files) {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (!this.dryRun) {
                  _context3.next = 3;
                  break;
                }

                logger('Dry Run:', files, 'added to git');

                return _context3.abrupt('return', this);

              case 3:
                _context3.prev = 3;
                _context3.next = 6;
                return this.client.add(files);

              case 6:
                logger(files, 'added to git');
                _context3.next = 13;
                break;

              case 9:
                _context3.prev = 9;
                _context3.t0 = _context3['catch'](3);

                logger('Failed to add files to git:', _context3.t0);
                process.exit(1);

              case 13:
                return _context3.abrupt('return', this);

              case 14:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this, [[3, 9]]);
      }));

      function add(_x) {
        return _ref3.apply(this, arguments);
      }

      return add;
    }()
  }, {
    key: 'commit',
    value: function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(message) {
        var commitOptions;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (!this.dryRun) {
                  _context4.next = 3;
                  break;
                }

                logger('Dry Run: Commit successful:', message);
                return _context4.abrupt('return', this);

              case 3:
                _context4.prev = 3;
                commitOptions = {};


                if (this.noVerify) {
                  commitOptions = _extends({}, commitOptions, {
                    '--no-verify': null
                  });
                }

                _context4.next = 8;
                return this.client.commit(message, null, commitOptions);

              case 8:

                logger('Commit successful:', message);
                _context4.next = 15;
                break;

              case 11:
                _context4.prev = 11;
                _context4.t0 = _context4['catch'](3);

                logger('Commit failed:', _context4.t0);
                process.exit(1);

              case 15:
                return _context4.abrupt('return', this);

              case 16:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this, [[3, 11]]);
      }));

      function commit(_x2) {
        return _ref4.apply(this, arguments);
      }

      return commit;
    }()
  }, {
    key: 'addTag',
    value: function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(tagName) {
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                if (!this.dryRun) {
                  _context5.next = 3;
                  break;
                }

                logger('Dry Run: Tag created:', tagName);
                return _context5.abrupt('return', this);

              case 3:
                _context5.prev = 3;
                _context5.next = 6;
                return this.client.addTag(tagName);

              case 6:
                logger('Tag created:', tagName);
                _context5.next = 13;
                break;

              case 9:
                _context5.prev = 9;
                _context5.t0 = _context5['catch'](3);

                logger('Tag creation failed:', _context5.t0);
                process.exit(1);

              case 13:
                return _context5.abrupt('return', this);

              case 14:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this, [[3, 9]]);
      }));

      function addTag(_x3) {
        return _ref5.apply(this, arguments);
      }

      return addTag;
    }()
  }, {
    key: 'deleteTag',
    value: function () {
      var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(tagName) {
        var tagOptions;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                if (!this.dryRun) {
                  _context6.next = 3;
                  break;
                }

                logger('Dry Run: Tag deleted:', tagName);
                return _context6.abrupt('return', this);

              case 3:
                _context6.prev = 3;
                tagOptions = ['--delete', '' + tagName];
                _context6.next = 7;
                return this.client.tag(tagOptions);

              case 7:
                logger('Tag deleted:', tagName);
                _context6.next = 14;
                break;

              case 10:
                _context6.prev = 10;
                _context6.t0 = _context6['catch'](3);

                logger('Tag deletion failed:', _context6.t0);
                process.exit(1);

              case 14:
                return _context6.abrupt('return', this);

              case 15:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this, [[3, 10]]);
      }));

      function deleteTag(_x4) {
        return _ref6.apply(this, arguments);
      }

      return deleteTag;
    }()
  }, {
    key: 'mergeFromTo',
    value: function () {
      var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(from, to) {
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.next = 2;
                return this.client.mergeFromTo(from, to);

              case 2:
                return _context7.abrupt('return', this);

              case 3:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function mergeFromTo(_x5, _x6) {
        return _ref7.apply(this, arguments);
      }

      return mergeFromTo;
    }()
  }, {
    key: 'push',
    value: function () {
      var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(remote, branch) {
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                if (!this.dryRun) {
                  _context8.next = 3;
                  break;
                }

                logger('Dry Run: Files pushed to:', remote + ':' + branch);
                return _context8.abrupt('return', this);

              case 3:
                _context8.prev = 3;

                logger('Pushing to ' + branch);
                _context8.next = 7;
                return this.client.push(remote, branch);

              case 7:
                logger('Files pushed to:', remote + ':' + branch);
                _context8.next = 14;
                break;

              case 10:
                _context8.prev = 10;
                _context8.t0 = _context8['catch'](3);

                logger('Push failed:', _context8.t0);
                process.exit(1);

              case 14:
                return _context8.abrupt('return', this);

              case 15:
              case 'end':
                return _context8.stop();
            }
          }
        }, _callee8, this, [[3, 10]]);
      }));

      function push(_x7, _x8) {
        return _ref8.apply(this, arguments);
      }

      return push;
    }()
  }, {
    key: 'pushTags',
    value: function () {
      var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                if (!this.dryRun) {
                  _context9.next = 3;
                  break;
                }

                logger('Dry Run: Tags pushed to:', this.remote);
                return _context9.abrupt('return', this);

              case 3:
                _context9.prev = 3;
                _context9.next = 6;
                return this.client.pushTags(this.remote);

              case 6:
                logger('Tags pushed to:', this.remote);
                _context9.next = 13;
                break;

              case 9:
                _context9.prev = 9;
                _context9.t0 = _context9['catch'](3);

                logger('Failed to push tags:', _context9.t0);
                process.exit(1);

              case 13:
                return _context9.abrupt('return', this);

              case 14:
              case 'end':
                return _context9.stop();
            }
          }
        }, _callee9, this, [[3, 9]]);
      }));

      function pushTags() {
        return _ref9.apply(this, arguments);
      }

      return pushTags;
    }()
  }]);

  return GitClient;
}();

module.exports = GitClient;