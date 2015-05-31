/*
 * @fileOverview
 * @author: Mike Grabowski (@grabbou)
 */

'use strict';

var program = require('commander');
var Task = require('../tasks/generate-from-blueprint');
var Blueprint = require('../models/blueprint');
var _ = require('lodash');

var publicBlueprints = ['action', 'component', 'cursor', 'page', 'state', 'store', 'feature', 'element', 'translate'];

// Generate commands for all available public blueprints
_.each(publicBlueprints, function(blueprintType) {
  var blueprint = Blueprint.load(blueprintType);

  var cmd = blueprintType;

  _.forEach(blueprint.getArguments(), function(argument) {

    if (argument.required) {
      cmd += ' <' + argument.name + '> ';
    } else {
      cmd += ' [' + argument.name + '] ';
    }
  });

  var command = program
    .command(cmd)
    .description(blueprint.description)
    .action(function() {
      var task = new Task();
      var args = _.dropRight(arguments, 1);
      task.start(blueprintType, args, this.opts());
    });

  _.forEach(blueprint.getFlags(), function(flag) {
    command.option(flag.name, flag.description);
  });

});