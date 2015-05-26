/*
 * @fileOverview
 * @author: Mike Grabowski (@grabbou)
 */

'use strict';

var program = require('commander');
var Task = require('../tasks/generate-from-blueprint');
var _ = require('lodash');

/**
 * Creates new task and calls it
 * Strips 3 first elements as they are commander arguments
 */
function generateNewElement() {
  var task = new Task();
  task.run(arguments[0], arguments[1]);
}

program
  .command('generate <type> [options...]')
  .alias('g')
  .description('Generates new element')
  .action(generateNewElement);