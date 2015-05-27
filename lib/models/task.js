/*
 * @fileOverview
 * @author: Mike Grabowski (@grabbou)
 */

'use strict';

var CoreObject = require('core-object');
var chalk = require('chalk');

module.exports = Task;

function Task() {
  CoreObject.apply(this, arguments);
}

Task.__proto__ = CoreObject;
Task.prototype.constructor = Task;

/**
 * Private method for running tasks
 * @private
 */
Task.prototype._run = function() {
  throw new Error('Task needs to have run() defined.');
};

/**
 * Starts a task and returns a promise
 * Outputs additional messages when the stuff is done
 * @returns {Promise}
 */
Task.prototype.start = function() {
  return this._run
    .apply(this, arguments)
    .then(function() {
      console.log(chalk.blue('Task finished successfully'));
    })
    .catch(function(err) {
      console.log(chalk.bold.red(err.message || err));
      console.log(err.stack);
    });
};