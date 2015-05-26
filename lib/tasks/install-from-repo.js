/*
 * @fileOverview
 * @author: Mike Grabowski (@grabbou)
 */

'use strict';

var assert = require('assert');
var chalk = require('chalk');
var exec = require('child-process-promise').exec;
var fs = require('fs');
var Promise = require('bluebird');
var path = require('path');
var rimraf = require('rimraf');
var Task = require('../models/task');
var mkdirp = require('mkdirp');

module.exports = Task.extend({

  repoLink: 'https://github.com/steida/este',

  run: function runTask(passedArguments, passedOptions) {

    var name = passedArguments[0];
    var dest = passedArguments[1];

    var options = this._options = {
      name: name,
      dest: path.resolve(dest || './' + name)
    };

    this._ensureEmptyFolder(options.dest)
      .then(function() {
        console.log(chalk.blue('Cloning repository...'));
        return this._cloneRepo();
      }.bind(this))
      .tap(function goToFolder() {
        process.chdir(options.dest);
      })
      .then(function reinitialiseGit() {
        if (!passedOptions.keepGit) {
          console.log(chalk.blue('Reinitialising repository...'));
          return this._deleteGitFolder()
            .then(this._initGit.bind(this))
            .then(this._initialCommit.bind(this))
        }
      }.bind(this))
      .then(function() {
        console.log(chalk.blue('Installing npm dependencies...'));
        return this._npmInstall();
      }.bind(this))
      .then(this._npmDedupe.bind(this))
      .then(function onSuccess() {
        console.log(chalk.green('Este.js app created in ', options.dest));
      })
      .catch(function onError(err) {
        console.log(chalk.bold.red(err.message));
      });

  },

  /**
   * Makes sure task does not override another directory
   * @private
   * @method ensureEmptyFolder
   * @param folder
   * @returns {Promise}
   */
  _ensureEmptyFolder: function ensureEmptyFolder(folder) {
    return new Promise(function(resolve, reject) {
      fs.exists(folder, function(err, exists) {
        if (err || exists) return reject(new Error('Folder ' + folder + ' already exists. Please choose different one'));
        resolve();
      })
    });
  },

  /**
   * Clones repo to destination folder
   * @private
   * @method cloneRepo
   * @returns {Promise}
   */
  _cloneRepo: function cloneRepo() {
    return exec(
      'git clone --depth=1 ' + this.repoLink + ' ' + this._options.dest
    );
  },

  /**
   * Deletes current git
   * @private
   * @method deleteGitFolder
   * @returns {Promise}
   */
  _deleteGitFolder: function deleteGitFolder() {
    var dest = this._options.dest;
    return new Promise(function(resolve, reject) {
      rimraf(dest + '/.git', function(err, data) {
        if (err) return reject(err);
        resolve(data);
      })
    });
  },

  /**
   * Creates new git
   * @private
   * @method initGit
   * @returns {Promise}
   */
  _initGit: function initGit() {
    return exec('git init');
  },

  /**
   * Creates initial commit on master branch
   * @private
   * @method initalCommit
   * @returns Promise
   */
  _initialCommit: function initialCommit() {
    return exec('git add . && git commit -m "Initial commit"');
  },

  /**
   * Installs dependencies
   * @private
   * @method npmInstall
   * @returns {Promise}
   */
  _npmInstall: function npmInstall() {
    return exec('npm install');
  },

  /**
   * Optimises directory structure
   * @private
   * @method npmDedupe
   * @returns {Promise}
   */
  _npmDedupe: function npmDedupe() {
    return exec('npm dedupe react');
  }

});