/*
 * @fileOverview
 * @author: Mike Grabowski (@grabbou)
 */

'use strict';

var assert = require('assert');
var bl = require('bl');
var chalk = require('chalk');
var conflict = require('gulp-conflict');
var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var gulp = require('gulp');
var tap = require('gulp-tap');
var mustache = require('mustache');
var pascalCase = require('pascal-case');
var Promise = require('bluebird');

module.exports = Blueprint;

/**
 * @param blueprintPath
 * @constructor
 */
function Blueprint(blueprintPath) {
  this.path = blueprintPath;
  this.name = pascalCase(path.basename(blueprintPath));
}

/**
 * Parses and gets file tokens
 * @private
 * @param {Object} options
 * @returns {Object} file tokens
 */
Blueprint.prototype._mapFileTokens = function mapFileTokens(options) {
  var tokens = {
    __root__: options.rootFolder,
    __server__: options.serverFolder,
    __lib__: options.libFolder,
    __name__: options.blueprintName
  };
  if (_.isFunction(this.mapFileTokens)) {
    _.merge(tokens, this.mapFileTokens(options));
  }
  return tokens;
};

/**
 * Parses and gets template variables
 * @private
 * @param {File} file
 * @param {Object} options
 * @returns {Object} variables
 */
Blueprint.prototype._locals = function mapTemplateVariables(file, options) {
  var variables = {
    className: pascalCase(options.blueprintName),
    rootPath: (function() {
      var basePath = file.path.replace(file.base, '');
      return path.relative(path.dirname(basePath), options.rootFolder);
    })()
  };
  if (_.isFunction(this.locals)) {
    _.merge(variables, this.locals(file, options));
  }
  return variables;
};

/**
 * Replaces file path with tokens
 * @private
 * @param {String} path
 * @param {Object} tokens
 * @returns {String}
 */
Blueprint.prototype._replaceFilePath = function(path, tokens) {
  _.each(tokens, function(value, token) {
    path = path.replace(token, value);
  });
  return path.replace('.tpl', '');
};

/**
 * Installs files
 * @private
 * @method installBlueprint
 * @param {Object} options
 * @returns {Promise}
 */
Blueprint.prototype._installBlueprint = function(options) {
  var files = this.getFilesPath();
  var tokens = this._mapFileTokens(options);

  var stream = gulp.src(files)
    .pipe(tap(function(file) {
      file.path = this._replaceFilePath(file.path, tokens);
      var templateVariables = this._locals(file, options);
      file.contents = new Buffer(mustache.render(file.contents.toString(), templateVariables));
    }.bind(this)))
    .pipe(conflict('./'))
    .pipe(gulp.dest('./'));

  var promises = [];

  promises.push(new Promise(function(resolve, reject) {
    stream.on('end', resolve);
    stream.on('error', reject);
  }));

  if (_.isFunction(this.installBlueprint)) {
    promises.push(this.installBlueprint(options));
  }

  return Promise.all(promises);
};

/**
 * Resolves files within blueprint
 * @method getFilesPath
 */
Blueprint.prototype.getFilesPath = function getFilesPath() {
  return path.resolve(this.path, 'files/**/*.tpl');
};

/**
 * Starts installation process
 * @method install
 * @param {Object} options
 */
Blueprint.prototype.install = function installBlueprint(options) {
  _.defaults(options, {
    rootFolder: 'src/client',
    serverFolder: 'src/server',
    libFolder: 'src/lib',
    blueprintName: this.name
  });

  return this._process(
    options,
    this.beforeInstall,
    this._installBlueprint,
    this.afterInstall
  ).tap(function() {
      console.log(chalk.blue(this.name, 'generated successfully'));
    }.bind(this));
};

/**
 @private
 @method _process
 @param {Object} options
 @param {Function} beforeHook
 @param {Function} install
 @param {Function} afterHook
 */
Blueprint.prototype._process = function(options, beforeHook, install, afterHook) {
  return Promise.resolve()
    .then(beforeHook.bind(this, options))
    .then(install.bind(this, options))
    .then(afterHook.bind(this, options));
};

/**
 Hook for running operations before install.
 @method beforeInstall
 @return {Promise|null}
 */
Blueprint.prototype.beforeInstall = function() {};

/**
 Hook for running operations after install.
 @method afterInstall
 @return {Promise|null}
 */
Blueprint.prototype.afterInstall = function() {};

/**
 * Loads blueprint
 * @method load
 * @param {String} type
 * @returns {Blueprint}
 */
Blueprint.load = function(type) {
  var blueprintPath = path.resolve(__dirname, '../../blueprints', type);
  var constructorPath = path.resolve(blueprintPath, 'index.js');
  var blueprintModule = require(constructorPath);

  var instance = new Blueprint(blueprintPath);

  if (typeof blueprintModule === 'object') {
    _.assign(instance, blueprintModule);
  }

  return instance;
};