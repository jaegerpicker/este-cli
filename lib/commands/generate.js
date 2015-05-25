/*
 * @fileOverview
 * @author: Mike Grabowski (@grabbou)
 */

'use strict';

var program = require('commander');
var Task = require('../tasks/generate-from-blueprint');

function generateNewElement() {
  var task = new Task();
  var args = program.rawArgs;
  args.shift();
  args.shift();
  args.shift();
  task.run(args)
}

program
  .command('generate [type]')
  .alias('g')
  .description('Generates new element')
  .action(generateNewElement);