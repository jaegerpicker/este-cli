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

module.exports = Blueprint;

function Blueprint(blueprintPath) {
  this.path = blueprintPath;
  this.name = path.basename(blueprintPath);
}

// Map file tokens
Blueprint.prototype._mapFileTokens = function mapFileTokens(options) {
  var tokens = {
    __root__: options.rootFolder,
    __name__: (function() {
      return options.blueprintName;
    })()
  };
  if (_.isFunction(this.mapFileTokens)) {
    _.merge(tokens, this.mapFileTokens(options));
  }
  return tokens;
};

Blueprint.prototype._mapTemplateVariables = function mapTemplateVariables(options) {
  var variables = {

  };
  if (_.isFunction(this.mapTemplateVariables)) {
    _.merge(variables, this.mapTemplateVariables(options));
  }
  return variables;
};

Blueprint.prototype.getFilesPath = function getFilesPath() {
  return path.resolve(this.path, 'files/**/*.tpl');
};

// Starts installation of the blueprint
Blueprint.prototype.install = function installBlueprint(options) {
  _.merge(options, {
    rootFolder: 'src/client',
    blueprintName: this.name
  });

  var files = this.getFilesPath();
  var tokens = this._mapFileTokens(options);
  var templateVariables = this._mapTemplateVariables(options);

  gulp.src(files)
    .pipe(tap(function(file) {
      _.each(tokens, function(value, token) {
        file.path = file.path.replace(token, value)
      });
      file.path = file.path.replace('.tpl', '');
    }))
    .pipe(mustache(templateVariables))
    .pipe(gulp.dest('./'));
};

// Factory method to load blueprint
Blueprint.load = function(name) {
  var blueprintPath = path.resolve(__dirname, '../../blueprints', name);
  var constructorPath = path.resolve(blueprintPath, 'index.js');
  var blueprintModule = require(constructorPath);

  var instance = new Blueprint(blueprintPath);

  if (typeof blueprintModule === 'object') {
    _.merge(instance, blueprintModule);
  }

  return instance;
};