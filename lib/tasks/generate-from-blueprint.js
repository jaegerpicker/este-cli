/*
 * @fileOverview
 * @author: Mike Grabowski (@grabbou)
 */

'use strict';

var assert = require('assert');
var Blueprint = require('../models/blueprint');
var Task = require('../models/task');
var util = require('util');
var _ = require('lodash');

module.exports = Task.extend({
  blueprintMethod: 'install',

  _run: function runTask(blueprintType, passedArguments, passedFlags) {
    var options = {
      rootFolder: 'src/client',
      serverFolder: 'src/server',
      libFolder: 'src/lib',
      blueprintType: blueprintType
    };

    var blueprint = Blueprint.load(options.blueprintType);

    // Map passed arguments with wanted properties
    _.forEach(blueprint.getArguments(), function(argument, index) {
      options[argument.property] = passedArguments[index];
    });

    // Add flags to options
    _.assign(options, {
      flags: passedFlags
    });

    return blueprint[this.blueprintMethod](options);
  }
});