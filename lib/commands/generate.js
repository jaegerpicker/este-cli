/*
 * @fileOverview
 * @author: Mike Grabowski (@grabbou)
 */

'use strict';

var program = require('commander');
var Task = require('../tasks/generate-from-blueprint');
var Blueprint = require('../models/blueprint');
var _ = require('lodash');

var publicBlueprints = ['action', 'component', 'cursor', 'page', 'state', 'store'];

// Generate commands for all available public blueprints
_.each(publicBlueprints, function(blueprintType) {
  var blueprint = Blueprint.load(blueprintType);

  var command = blueprintType;

  _.forEach(blueprint.getArguments(), function(argument) {

    if (argument.required) {
      command += ' <' + argument.name + '> ';
    } else {
      command += ' [' + argument.name + '] ';
    }
  });

  program
    .command(command)
    .description(blueprint.description)
    .action(function() {
      var task = new Task();
      var args = _.dropRight(arguments, 1);
      task.run(blueprintType, args);
    });
});