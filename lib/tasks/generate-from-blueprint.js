/*
 * @fileOverview
 * @author: Mike Grabowski (@grabbou)
 */

'use strict';

var assert = require('assert');
var Blueprint = require('../models/blueprint');
var chalk = require('chalk');
var Task = require('../models/task');
var util = require('util');
var _ = require('lodash');

module.exports = Task.extend({
  blueprintMethod: 'install',

  run: function runTask(passedArguments) {
    var blueprintType = passedArguments.shift();

    assert(blueprintType, 'You must provide [type] for this command');

    var options = {
      rootFolder: 'src/client',
      serverFolder: 'src/server',
      libFolder: 'src/lib',
      blueprintType: blueprintType
    };

    var blueprint = Blueprint.load(options.blueprintType);

    // Assert the values
    _.forEach(blueprint.getArguments(), function(argument, index) {
      var variable = passedArguments[index];
      if (!variable && argument.required) {
        assert(variable, 'You must provide [' + argument.name + '] for this generator');
      }
      options[argument.property] = variable;
    });

    console.log(options);

    return blueprint[this.blueprintMethod](options)
      .then(function() {
        console.log(chalk.blue('Task finished successfully'));
      })
      .catch(function(err) {
        console.log(chalk.bold.red(err.message || err));
        console.log(err.stack);
      });
  }
});