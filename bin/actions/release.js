'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var shell = require('shelljs');
var GitClient = require('../helpers/git');
var bumpAction = require('../actions/bump');
var logger = require('debug')('Semver-Release');

var defaultOptions = {
  gitRoot: '.',
  increment: 'prerelease',
  identifier: 'next',
  remote: 'origin',
  branch: 'development',
  libRoot: './lib',
  dryRun: false,
  publish: false,
  add: false,
  commit: false,
  tag: false
};

var releaseAction = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(options) {
    var releaseOptions, gitClient, branch, ignoreArr, bumped, publishCommand, publish;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            releaseOptions = Object.assign({}, defaultOptions, options);


            if (releaseOptions.dryRun) {
              logger('*******************************************');
              logger('* DRY RUN MODE ENABLED');
              logger('* No changes will be applied');
              logger('*******************************************');
              logger('');
            }

            // console.log(releaseOptions)
            gitClient = new GitClient(releaseOptions.gitRoot);
            _context.next = 5;
            return gitClient.client.branch();

          case 5:
            branch = _context.sent;


            if (!releaseOptions.branch) {
              releaseOptions.branch = branch.current;
            }

            logger('Current branch:', releaseOptions.branch);

            if (releaseOptions.addIgnore) {
              ignoreArr = Array.from(releaseOptions.addIgnore);


              if (Array.isArray(ignoreArr)) {
                ignoreArr.forEach(gitClient.addIgnoreFile);
              }
            }

            // Setup client
            gitClient.addIgnoreFile('package.json').addIgnoreFile('.npmrc').setDryRun(releaseOptions.dryRun).setRemote(releaseOptions.remote).setBranch(releaseOptions.branch);

            // Check is current working directory is a valid git repository
            _context.next = 12;
            return gitClient.isRepo();

          case 12:
            _context.next = 14;
            return bumpAction({
              increment: releaseOptions.increment,
              identifier: releaseOptions.identifier
            });

          case 14:
            _context.next = 16;
            return bumpAction({
              increment: releaseOptions.increment,
              identifier: releaseOptions.identifier,
              root: releaseOptions.libRoot
            });

          case 16:
            bumped = _context.sent;
            _context.next = 19;
            return gitClient.isDirty();

          case 19:
            if (!releaseOptions.publish) {
              _context.next = 30;
              break;
            }

            logger('Publishing ' + bumped.version);

            publishCommand = ['npm publish ' + releaseOptions.libRoot];


            if (releaseOptions.identifier) {
              publishCommand.push('--tag ' + releaseOptions.identifier);
            }

            publishCommand = publishCommand.join(' ');

            if (releaseOptions.dryRun) {
              _context.next = 29;
              break;
            }

            _context.next = 27;
            return shell.exec(publishCommand);

          case 27:
            publish = _context.sent;


            if (publish.code !== 0) {
              logger('Publishing failed: exiting');
              process.exit(1);
            }

          case 29:

            logger(bumped.version + ' successfully published');

          case 30:
            if (!releaseOptions.add) {
              _context.next = 33;
              break;
            }

            _context.next = 33;
            return gitClient.add(['package.json']);

          case 33:
            if (!releaseOptions.commit) {
              _context.next = 44;
              break;
            }

            _context.prev = 34;
            _context.next = 37;
            return gitClient.commit('Bumped version to ' + bumped.version + ' ***NO_CI***');

          case 37:
            _context.next = 39;
            return gitClient.push(gitClient.remote, 'HEAD:' + gitClient.branch);

          case 39:
            _context.next = 44;
            break;

          case 41:
            _context.prev = 41;
            _context.t0 = _context['catch'](34);

            logger('Push failed:', _context.t0);

          case 44:
            if (!releaseOptions.tag) {
              _context.next = 49;
              break;
            }

            _context.next = 47;
            return gitClient.addTag(bumped.version);

          case 47:
            _context.next = 49;
            return gitClient.pushTags();

          case 49:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[34, 41]]);
  }));

  return function releaseAction(_x) {
    return _ref.apply(this, arguments);
  };
}();

module.exports = releaseAction;