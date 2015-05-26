/*
 * @fileOverview
 * @author: Mike Grabowski (@grabbou)
 */

'use strict';

var pkg = require('../package.json');
var updateNotifier = require('update-notifier');
var program = require('commander');

// Check for updates once a day
updateNotifier({pkg: pkg}).notify();

// Create CLI
program
  .version(pkg.version);

// Load commands
require('./commands');

program.parse(process.argv);
