/*
 * @fileOverview
 * @author: Mike Grabowski (@grabbou)
 */

'use strict';

var camelCase = require('camel-case');
var recast = require('recast');
var File = require('../../lib/models/File');
var Promise = require('bluebird');
var path = require('path');
var fs = require('fs');

module.exports = {

  description: 'Generates new cursor',

  skipExistingFiles: true,

  afterInstall: function(options) {
    var statePath = path.join(options.rootFolder, 'state.js');
    var blueprintName = camelCase(options.blueprintName) + 'Cursor';

    var file = File.load(statePath);

    if (!file.hasVariableInScope('state')) {
      return Promise.reject('No state in state.js file. Please create a new instance before adding a new cursor');
    }

    if (!file.getVariable(blueprintName)) {
      file.appendCode('export const ' + blueprintName + ' = state.cursor([\'' + blueprintName + '\'])');
    }

    return new Promise.fromNode(function(callback) {
      fs.writeFile(statePath, file.print(), callback);
    });

  }
};