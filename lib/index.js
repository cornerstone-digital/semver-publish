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
  .option('-t, --increment <increment>', 'Release increment type')
  .option('-i, --identifier <identifier>', 'Release identifier')
  .option('-r, --gitRoot <gitDir>', 'Root of git Repository')
  .option('-l, --libRoot <libRoot>', 'Root of compiled library')
  .option('-r, --remote, <name>', 'Git remote name')
  .option('-b, --branch <name>', 'Git branch name')
  .action(releaseAction)

cli.parse(process.argv)
