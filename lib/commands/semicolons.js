/*
 * @fileOverview
 * @author: Mike Grabowski (@grabbou)
 */

'use strict';

var Task = require('../tasks/toggle-semicolons');
var program = require('commander');

function toggleSemicolons() {
  var task = new Task();
  task.run();
}

program
  .command('semicolons')
  .description('Toggles semicolons in Este.js project')
  .action(toggleSemicolons);