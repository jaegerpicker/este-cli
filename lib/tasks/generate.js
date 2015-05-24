/*
 * @fileOverview
 * @author: Mike Grabowski (@grabbou)
 */

'use strict';

var program = require('commander');

function generateBlueprint(blueprint, name) {

}

program
  .command('generate [blueprint] [name]')
  .alias('g')
  .description('Creates new page')
  .action(generateBlueprint);