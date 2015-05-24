/*
 * @fileOverview
 * @author: Mike Grabowski (@grabbou)
 */

'use strict';

var assert = require('assert');
var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var gulp = require('gulp');
var tap = require('gulp-tap');
var mustache = require('gulp-mustache');
var pascalCase = require('pascal-case');

module.exports = Blueprint;

/**
 * @param blueprintPath
 * @constructor
 */
function Blueprint(blueprintPath) {
  this.path = blueprintPath;
  this.name = path.basename(blueprintPath);
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
 * @param {Object} options
 * @returns {Object} variables
 */
Blueprint.prototype._mapTemplateVariables = function mapTemplateVariables(options) {
  var variables = {
    className: pascalCase(options.blueprintName)
  };
  if (_.isFunction(this.mapTemplateVariables)) {
    _.merge(variables, this.mapTemplateVariables(options));
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
    blueprintName: this.name
  });

  var files = this.getFilesPath();
  var tokens = this._mapFileTokens(options);
  var templateVariables = this._mapTemplateVariables(options);

  gulp.src(files)
    .pipe(tap(function(file) {
      file.path = this._replaceFilePath(file.path, tokens);
    }.bind(this)))
    .pipe(mustache(templateVariables))
    .pipe(gulp.dest('./'));
};

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