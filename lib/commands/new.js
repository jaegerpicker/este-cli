/*
 * @fileOverview
 * @author: Mike Grabowski (@grabbou)
 */

'use strict';

var Task = require('../tasks/install-from-repo');
var program = require('commander');
var _ = require('lodash');

function createNewProject() {
  var task = new Task();
  var args = _.drop(program.rawArgs, 3);
  task.run(args)
}



program
  .command('new [name] [dest]')
  .alias('n')
  .description('Creates new Este.js project')
  .action(createNewProject);