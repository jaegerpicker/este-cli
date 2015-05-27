/*
 * @fileOverview
 * @author: Mike Grabowski (@grabbou)
 */

'use strict';

var Task = require('../tasks/toggle-semicolons');
var program = require('commander');
var _ = require('lodash');

function toggleSemicolons() {
  var task = new Task();
  var args = _.dropRight(arguments, 1);
  task.start(args, this.opts());
}

program
  .command('semicolons')
  .description('Toggles semicolons in Este.js project')
  .option('-a, --add', 'Adds semicolons, removes them otherwise')
  .action(toggleSemicolons);