/*
 * @fileOverview
 * @author: Mike Grabowski (@grabbou)
 */

'use strict';

var CoreObject = require('core-object');
var chalk = require('chalk');
var Promise = require('bluebird');
var lstatAsync = Promise.promisify(require('fs').lstat);
var _ = require('lodash');

module.exports = Task;

function Task() {
  CoreObject.apply(this, arguments);
}

Task.__proto__ = CoreObject;
Task.prototype.constructor = Task;

// @TODO Move this config elsewhere and add .esterc
Task.prototype.getConfig = function() {
  return {
    rootFolder: 'src/client',
    serverFolder: 'src/server',
    libFolder: 'src/lib'
  };
};

/**
 * Private method for running tasks
 * @private
 */
Task.prototype._run = function() {
  throw new Error('Task needs to have run() defined.');
};

/**
 * Checks if the current directory is Este.js project
 * @private
 * @returns {Promise}
 */
Task.prototype._ensureEsteProject = function() {
  var options = this.getConfig();
  var foldersToCheck = [options.rootFolder, options.serverFolder];

  return Promise
    .each(foldersToCheck, function(folder) {
      return lstatAsync(folder);
    })
    .catch(function() {
      throw new Error('Not an Este.js project');
    });
};

/**
 * Starts a task and returns a promise
 * Outputs additional messages when the stuff is done
 * @returns {Promise}
 */
Task.prototype.start = function() {
  var args = arguments;
  var beforeRun = this.skipEsteCheck ? Promise.resolve() : this._ensureEsteProject();

  return beforeRun
    .then(function runTask() {
      return this._run.apply(this, args);
    }.bind(this))
    .then(function() {
      console.log(chalk.blue('Task finished successfully'));
    })
    .catch(function(err) {
      console.log(chalk.bold.red(err.message || err));
    });
};