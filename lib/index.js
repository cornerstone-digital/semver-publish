#!/usr/bin/env node

const cli = require('commander')
const pkg = require('../package.json')
const bumpAction = require('./actions/bump')
const releaseAction = require('./actions/release')
cli.version(pkg.version, '-v, --version')

cli
  // Accepted Increments: major, premajor, minor, preminor, patch, prepatch, or prerelease
  .command('bump')
  .option('-v, --increment <increment>', 'Release version increment type')
  .option('-i, --identifier <identifier>', 'Release identifier')
  .option('-r, --root <package>', 'Root of package containing package.json')
  .action(bumpAction)

cli.command('release')
  .option('-v, --increment <increment>', 'Release version increment type')
  .option('-i, --identifier <identifier>', 'Release identifier')
  .option('-r, --gitRoot <gitDir>', 'Root of git Repository')
  .option('-l, --libRoot <libRoot>', 'Root of compiled library')
  .option('-a, --addIgnore <fileList>', 'Whether to ignore certain files')
  .option('-r, --remote, <name>', 'Git remote name')
  .option('-b, --branch <name>', 'Git branch name')
  .option('-d, --dryRun', 'Whether to dry run only')
  .option('-a, --add', 'Whether to add to git')
  .option('-p, --publish', 'Whether to publish package')
  .option('-t, --tag', 'Whether to tag release')
  .option('-c, --commit', 'Whether to commit')
  .option('-n, --noVerify', 'No verifing of git-hooks')
  .action(releaseAction)

cli.parse(process.argv)
