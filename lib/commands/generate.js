/*
 * @fileOverview
 * @author: Mike Grabowski (@grabbou)
 */

'use strict';

var assert = require('assert');
var program = require('commander');
var Task = require('../tasks/generate-from-blueprint');

function generateNewElement(type, name) {
  assert(type, 'You must provide [type] for the generate command');
  assert(name, 'You must provide [name] for the generate command');

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