#!/usr/bin/env node

const cli = require('commander')
const pkg = require('../package.json')
const bumpAction = require('./actions/bump')
cli.version(pkg.version, '-v, --version')

cli
  // Accepted Increments: major, premajor, minor, preminor, patch, prepatch, or prerelease
  .command('bump [increment]')
  .option('-i, --identifier <value>', 'Release identifier')
  .action(bumpAction)

cli.parse(process.argv)
