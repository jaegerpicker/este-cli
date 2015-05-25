/*
 * @fileOverview
 * @author: Mike Grabowski (@grabbou)
 */

'use strict';

var Blueprint = require('../models/blueprint');
var chalk = require('chalk');
var Task = require('../models/task');
var util = require('util');
var _ = require('lodash');

module.exports = Task.extend({
  blueprintMethod: 'install',

  run: function runTask(options) {
    _.defaults(options, {
      rootFolder: 'src/client',
      serverFolder: 'src/server',
      libFolder: 'src/lib'
    });

    var blueprint = Blueprint.load(options.blueprintType);

    return blueprint[this.blueprintMethod](options)
      .then(function() {
        console.log(chalk.blue('Task finished successfully'));
      })
      .catch(function(err) {
        console.log(chalk.bold.red(err.message || err));
      });
  }
});