/*
 * @fileOverview
 * @author: Mike Grabowski (@grabbou)
 */

'use strict';

var chalk = require('chalk');
var program = require('commander');
var Blueprint = require('../models/blueprint');

function generateNewElement(type, name) {
  var blueprint = Blueprint.load(type);

  blueprint.install({
      blueprintName: name
  }).then(function() {
    console.log(chalk.blue(blueprint.name, 'generated successfully'));
  });
}

program
  .command('generate [type] [name]')
  .alias('g')
  .description('Generates new element')
  .action(generateNewElement);