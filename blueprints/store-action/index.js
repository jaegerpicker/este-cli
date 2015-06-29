/*
 * @fileOverview
 * @author: Mike Grabowski (@grabbou)
 */

'use strict';

var Promise = require('bluebird');
var Blueprint = require('../../lib/models/blueprint');
var path = require('path');
var camelCase = require('camel-case');
var File = require('../../lib/models/file');
var fs = require('fs');
var _ = require('lodash');

module.exports = {

  description: 'Generates new store switch for action',

  // Ensure store is there
  beforeInstall: function(options) {

    // Override store generator settings so instead of creating a store
    // it just ensures its already there
    var storeBlueprint = Blueprint.load('store');
    storeBlueprint.skipExistingFiles = true;

    return storeBlueprint.install(options);
  },

  // Update store with appropriate action
  afterInstall: function(options) {

    // Ignore if no action specified
    if (!options.blueprintAction || !options.blueprintName) return;

    var actionName = camelCase(options.blueprintAction);

    // Load store file
    var storePath = path.join(options.rootFolder, options.blueprintName, 'store.js');
    var file = File.load(storePath);

    // Find dispatchToken export declaration
    // Check if actions are imported
    var dispatchToken = file.getVariable('dispatchToken');
    var actionImport = file.getImportDeclaration('./actions');

    if (!dispatchToken) {
      return Promise.reject('No dispatchToken is exported from your app. Please check your store file');
    }

    if (!actionImport) {
      actionImport = file.addImportDeclaration('actions', './actions');
    }

    if (!actionImport.importsVariable(actionName)) {
      actionImport.importVariable(actionName);
    }

    var switchStatement = file.getSwitchStatement(dispatchToken);

    // @TODO create one if missing
    if (!switchStatement) {
      return Promise.reject('No switch statement present in your app. Please check your store file');
    }

    var actionIdentifier = actionImport.getVariableIdentifier(actionName);

    if (!switchStatement.hasSwitchCase(actionIdentifier)) {
      switchStatement.addSwitchCase(actionIdentifier);
    }

    return new Promise.fromNode(function(callback) {
      fs.writeFile(storePath, file.print(), callback);
    });

  }

};