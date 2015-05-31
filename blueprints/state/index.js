/*
 * @fileOverview
 * @author: Mike Grabowski (@grabbou)
 */

'use strict';

var camelCase = require('camel-case');
var Promise = require('bluebird');
var File = require('../../lib/models/file');
var path = require('path');
var fs = require('fs');

module.exports = {

  description: 'Generates new state',

  skipExistingFiles: true,

  afterInstall: function(options) {
    var statePath = path.join(options.serverFolder, 'initialstate.js');
    var stateName = camelCase(options.blueprintName);

    var file = File.load(statePath);

    // Get states by assuming they are exported from initialstate.js file
    var states = file.getObjectExpression();

    if (!states) {
      return Promise.reject('No export declaration in initialstate.js. Please check your file');
    }

    if (!states.hasProperty(stateName)) {
      states.addProperty(stateName);
    }

    return new Promise.fromNode(function(callback) {
      fs.writeFile(statePath, file.print(), callback);
    });

  }
};