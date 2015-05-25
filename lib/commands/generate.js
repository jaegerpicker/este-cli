/*
 * @fileOverview
 * @author: Mike Grabowski (@grabbou)
 */

'use strict';

var program = require('commander');
var Blueprint = require('../models/blueprint');

function generateNewElement(type, name) {
  var blueprint = Blueprint.load(type);

  blueprint.install({
      blueprintName: name
  });
}

program
  .command('generate [type] [name]')
  .alias('g')
  .description('Generates new element')
  .action(generateNewElement);