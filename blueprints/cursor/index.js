/*
 * @fileOverview
 * @author: Mike Grabowski (@grabbou)
 */

'use strict';

var recast = require('recast');
var Promise = require('bluebird');
var path = require('path');
var fs = require('fs');

var getCursors = require('./helpers/get-cursors');
var buildNode = require('./helpers/cursor-node');
var hasCursor = require('./helpers/has-cursor');

module.exports = {

  installBlueprint: function(options) {
    var statePath = path.join(options.serverFolder, 'initialstate.js');
    var data = recast.parse(fs.readFileSync(statePath).toString());
    var cursors = getCursors(data);

    if (!cursors) {
      return Promise.reject('Invalid initialstate.js file');
    }

    var node = buildNode(options);

    // Do nothing if already there
    if (hasCursor(cursors, node)) {
      return Promise.resolve();
    } else {
      cursors.value.declaration.properties.push(node);
    }

    return new Promise.fromNode(function(callback) {
      var modifiedElement = recast.print(data).code;
      fs.writeFile(statePath, modifiedElement, callback);
    });

  }
};