/*
 * @fileOverview
 * @author: Mike Grabowski (@grabbou)
 */

'use strict';

var assert = require('assert');
var bl = require('bl');
var conflict = require('gulp-conflict');
var path = require('path');
var fs = require('fs');
var gulp = require('gulp');
var gulpif = require('gulp-if');
var gulpIgnore = require('gulp-ignore');
var mustache = require('mustache');
var map = require('map-stream');
var pascalCase = require('pascal-case');
var camelCase = require('camel-case');
var Promise = require('bluebird');
var _ = require('lodash');

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
  var filePath = file.path.replace(file.base, '');
  var rootPath = path.relative(path.dirname(filePath), options.rootFolder);

  var variables = {
    className: pascalCase(options.blueprintName),
    camelName: camelCase(options.blueprintName),
    rootPath: rootPath,
    folderPath: (function() {
      var folderPath = rootPath.split('/');
      folderPath.pop();
      return folderPath.join('/') || '.';
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
Blueprint.prototype.installBlueprint = function(options) {
  var files = this.getFilesPath();
  var tokens = this._mapFileTokens(options);

  var stream = gulp.src(files)
    .pipe(map(function(file, callback) {
      file.path = this._replaceFilePath(file.path, tokens);
      var templateVariables = this._locals(file, options);
      file.contents = new Buffer(mustache.render(file.contents.toString(), templateVariables));
      callback(null, file);
    }.bind(this)))
    .pipe(gulpif(
      this.skipExistingFiles,
      map(function(file, callback) {
        var basePath = file.path.replace(file.base, '');
        var destPath = path.resolve(basePath);
        fs.lstat(destPath, function(err) {
          if (err) return callback(null, file);
          callback();
        })
      }),
      conflict('./')
    ))
    .pipe(gulp.dest('./'));

  return new Promise(function(resolve, reject) {
    stream.on('end', resolve);
    stream.on('error', reject);
  });
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
  return this._process(
    options,
    this.beforeInstall,
    this.installBlueprint,
    this.afterInstall
  );
};

Blueprint.prototype.getArguments = function getArguments() {
  return this._args.concat(this.args);
};

/**
 * Default arguments
 * @type {Array}
 */
Blueprint.prototype._args = [{
  name: 'name',
  property: 'blueprintName',
  required: true
}];

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