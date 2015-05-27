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
    var options = _.merge(this.getConfig(), {
      blueprintType: blueprintType,
      flags: passedFlags
    });

    var blueprint = Blueprint.load(blueprintType);

    // Map passed arguments with wanted properties
    _.forEach(blueprint.getArguments(), function(argument, index) {
      options[argument.property] = passedArguments[index];
    });

    return blueprint[this.blueprintMethod](options);
  }
});