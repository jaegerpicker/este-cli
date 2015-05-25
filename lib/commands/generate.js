/*
 * @fileOverview
 * @author: Mike Grabowski (@grabbou)
 */

'use strict';

var program = require('commander');
var Task = require('../tasks/generate-from-blueprint');

function generateNewElement(type, name) {
  var task = new Task();
  task.run({
    blueprintType: type,
    blueprintName: name
  });
}

program
  .command('generate [type] [name]')
  .alias('g')
  .description('Generates new element')
  .action(generateNewElement);