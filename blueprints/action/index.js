/*
 * @fileOverview
 * @author: Mike Grabowski (@grabbou)
 */

'use strict';

var Blueprint = require('../../lib/models/blueprint');
var File = require('../../lib/models/file');
var Promise = require('bluebird');
var recast = require('recast');
var b = recast.types.builders;
var camelCase = require('camel-case');
var path = require('path');
var fs = require('fs');
var _ = require('lodash');

module.exports = {

  // This blueprint only ensures actions file exists, so skip by default
  skipExistingFiles: true,

  // Additional optional argument
  args: [{
    type: String,
    name: 'action',
    property: 'blueprintAction'
  }],

  description: 'Generates new action',

  afterInstall: function(options) {

    // No action specified, skip adding it
    if (!options.blueprintAction) return;

    var blueprintAction = camelCase(options.blueprintAction);
    var actionPath = path.join(options.rootFolder, options.blueprintName, 'actions.js');
    var file = File.load(actionPath);

    if (!file.hasVariableInScope('dispatch')) {
      return Promise.reject('You must import dispatch method from a dispatcher');
    }

    var setToString = file.getMethodByInvocation('setToString');

    if (!setToString) {
      return Promise.reject('Couldn\'t find `setToString` method. Make sure it exists');
    }

    if (!file.getFunctionDeclaration(blueprintAction)) {
      var functionDeclaration = [
        '',
        'export function ' + blueprintAction + '() {',
        '  dispatch(' + blueprintAction + ');',
        '}'
      ];
      file.prependCode(setToString, functionDeclaration.join('\n'));
    }

    var definedStrings = file.getObjectExpression(setToString);

    if (!definedStrings.hasProperty(blueprintAction)) {
      definedStrings.addProperty(blueprintAction, true);
    }

    return new Promise
      .fromNode(function(callback) {
        fs.writeFile(actionPath, file.print(), callback);
      })
      .then(function() {
        return Blueprint.load('store-action').install(options);
      });
  }
};