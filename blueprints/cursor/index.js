/*
 * @fileOverview
 * @author: Mike Grabowski (@grabbou)
 */

'use strict';

var recast = require('recast');
var Promise = require('bluebird');
var path = require('path');
var fs = require('fs');

var getStates = require('./helpers/get-states');
var buildNode = require('./helpers/state-node');
var hasState = require('./helpers/has-state');

module.exports = {

  skipExistingFiles: true,

  afterInstall: function(options) {
    //var statePath = path.join(options.serverFolder, 'initialstate.js');
    //var data = recast.parse(fs.readFileSync(statePath).toString());
    //var states = getStates(data);
    //
    //if (!states) {
    //  return Promise.reject('Invalid initialstate.js file');
    //}
    //
    //var node = buildNode({
    //  name: options.blueprintName
    //});
    //
    //// Do nothing if already there
    //if (hasStates(states, node)) {
    //  return Promise.resolve();
    //} else {
    //  states.value.declaration.properties.push(node);
    //}
    //
    //return new Promise.fromNode(function(callback) {
    //  var modifiedElement = recast.print(data).code;
    //  fs.writeFile(statePath, modifiedElement, callback);
    //});

  }
};