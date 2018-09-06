#!/usr/bin/env node

const cli = require('commander')
const pkg = require('../package.json')
const bumpAction = require('./actions/bump')
const releaseAction = require('./actions/release')
cli.version(pkg.version, '-v, --version')

cli
  // Accepted Increments: major, premajor, minor, preminor, patch, prepatch, or prerelease
  .command('bump [increment]')
  .option('-i, --identifier <identifier>', 'Release identifier')
  .option('-r, --root <package>', 'Root of package containing package.json')
  .action(bumpAction)

cli.command('release')
  .option('--increment <increment>', 'Release increment type')
  .option('--identifier <identifier>', 'Release identifier')
  .option('--gitRoot <gitDir>', 'Root of git Repository')
  .option('--libRoot <libRoot>', 'Root of compiled library')
  .option('--remote, <name>', 'Git remote name')
  .option('--branch <name>', 'Git branch name')
  .option('--dryRun', 'Whether to dry run only')
  .option('--tag', 'Whether to tag release or not')
  .action(releaseAction)

cli.parse(process.argv)
