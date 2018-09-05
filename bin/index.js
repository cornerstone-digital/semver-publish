'use strict';

var cli = require('commander');
var pkg = require('../package.json');
var bumpAction = require('./actions/bump');
cli.version(pkg.version, '-v, --version');

cli
// Accepted Increments: major, premajor, minor, preminor, patch, prepatch, or prerelease
.command('bump [increment]').option('-i, --identifier <value>', 'Release identifier').action(bumpAction);

cli.parse(process.argv);