#!/usr/bin/env node

const cli = require('commander')
const pkg = require('../package.json')
const bumpAction = require('./actions/bump')
const publishAction = require('./actions/release')
cli.version(pkg.version, '-v, --version')

cli
  // Accepted Increments: major, premajor, minor, preminor, patch, prepatch, or prerelease
  .command('bump [increment]')
  .option('-i, --identifier <identifier>', 'Release identifier')
  .option('-r, --root <package>', 'Root of package containing package.json')
  .action(bumpAction)

  .command('release [dir]')
  .option('-r, --remote, <name>', 'Git remote name')
  .option('-b, --branch <name>', 'Git branch name')
  .action(publishAction)

cli.parse(process.argv)
