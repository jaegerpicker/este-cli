/*
 * @fileOverview
 * @author: Mike Grabowski (@grabbou)
 */

'use strict';

var pkg = require('../package.json');
var program = require('commander');

// Create CLI
program
  .version(pkg.version);

// Load tasks
require('./tasks');

program.parse(process.argv);