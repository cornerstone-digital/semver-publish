'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var shell = require('shelljs');
var GitClient = require('../helpers/git');
var bumpAction = require('../actions/bump');
var logger = require('debug')('Semver-Release');

var defaultOptions = {
  gitRoot: process.env.RELEASE_GIT_ROOT || '.',
  increment: process.env.RELEASE_INCREMENT || 'prerelease',
  identifier: process.env.RELEASE_IDENTIFIER || 'next',
  remote: process.env.RELEASE_GIT_REMOTE || 'origin',
  branch: process.env.RELEASE_GIT_BRANCH || 'development',
  libRoot: process.env.RELEASE_LIB_ROOT || './lib',
  dryRun: process.env.RELEASE_DRY_RUN || false,
  publish: process.env.RELEASE_NPM_PUBLISH || false,
  add: process.env.RELEASE_GIT_ADD || false,
  commit: process.env.RELEASE_GIT_COMMIT || false,
  tag: process.env.RELEASE_GIT_TAG || false,
  npmTag: process.env.RELEASE_NPM_TAG || 'latest',
  noVerify: process.env.RELEASE_GIT_NO_VERIFY || false,
  merge: process.env.RELEASE_GIT_MERGE || false,
  mergeBranch: process.env.RELEASE_GIT_MERGE_BRANCH || 'development'
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

            logger('Current WorkingDir:', process.cwd());
            logger('Current branch:', releaseOptions.branch);

            if (releaseOptions.addIgnore) {
              ignoreArr = releaseOptions.addIgnore.split(',');


              if (Array.isArray(ignoreArr)) {
                ignoreArr.forEach(function (file) {
                  return gitClient.addIgnoreFile(file);
                });
              }
            }

            // Setup client
            gitClient
            // .addIgnoreFile('package.json')
            .addIgnoreFile('.npmrc').addIgnoreFile('yarn-lock').addIgnoreFile('yarn-error.log')
            // .addIgnoreFile('lib/package.json')
            .setDryRun(releaseOptions.dryRun).setRemote(releaseOptions.remote).setBranch(releaseOptions.branch).setNoVerify(releaseOptions.noVerify);

            // Check is current working directory is a valid git repository
            _context.next = 13;
            return gitClient.isRepo();

          case 13:
            _context.next = 15;
            return bumpAction({
              increment: releaseOptions.increment,
              identifier: releaseOptions.identifier,
              root: releaseOptions.libRoot
            });

          case 15:
            bumped = _context.sent;
            _context.next = 18;
            return gitClient.isDirty();

          case 18:
            if (!releaseOptions.publish) {
              _context.next = 29;
              break;
            }

            logger('Publishing ' + bumped.version);

            publishCommand = ['npm publish ' + releaseOptions.libRoot];


            if (releaseOptions.identifier) {
              publishCommand.push('--tag ' + releaseOptions.identifier);
            }

            publishCommand = publishCommand.join(' ');

            if (releaseOptions.dryRun) {
              _context.next = 28;
              break;
            }

            _context.next = 26;
            return shell.exec(publishCommand);

          case 26:
            publish = _context.sent;


            if (publish.code !== 0) {
              logger('Publishing failed: exiting');
              process.exit(1);
            }

          case 28:

            logger(bumped.version + ' successfully published');

          case 29:
            if (!releaseOptions.add) {
              _context.next = 32;
              break;
            }

            _context.next = 32;
            return gitClient.add(['package.json']);

          case 32:
            if (!releaseOptions.commit) {
              _context.next = 43;
              break;
            }

            _context.prev = 33;
            _context.next = 36;
            return gitClient.commit('Bumped version to ' + bumped.version + ' ***NO_CI***');

          case 36:
            _context.next = 38;
            return gitClient.push(gitClient.remote, 'HEAD:' + gitClient.branch);

          case 38:
            _context.next = 43;
            break;

          case 40:
            _context.prev = 40;
            _context.t0 = _context['catch'](33);

            logger('Push failed:', _context.t0);

          case 43:
            if (!releaseOptions.tag) {
              _context.next = 48;
              break;
            }

            _context.next = 46;
            return gitClient.addTag(bumped.version);

          case 46:
            _context.next = 48;
            return gitClient.pushTags();

          case 48:
            if (!releaseOptions.merge) {
              _context.next = 61;
              break;
            }

            _context.next = 51;
            return gitClient.checkout(releaseOptions.mergeBranch);

          case 51:
            _context.next = 53;
            return gitClient.pull();

          case 53:
            _context.next = 55;
            return gitClient.merge(releaseOptions.branch);

          case 55:
            _context.next = 57;
            return gitClient.add('.');

          case 57:
            _context.next = 59;
            return gitClient.commit(bumped.version + ' published ***NO_CI***');

          case 59:
            _context.next = 61;
            return gitClient.push(gitClient.remote, 'HEAD:' + releaseOptions.mergeBranch);

          case 61:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[33, 40]]);
  }));

  return function releaseAction(_x) {
    return _ref.apply(this, arguments);
  };
}();

module.exports = releaseAction;