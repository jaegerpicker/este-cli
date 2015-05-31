/*
 * @fileOverview
 * @author: Mike Grabowski (@grabbou)
 */

'use strict';

var Promise = require('bluebird');
var Blueprint = require('../../lib/models/blueprint');
var path = require('path');
var recast = require('recast');
var b = recast.types.builders;
var n = recast.types.namedTypes;
var camelCase = require('camel-case');
var File = require('../../lib/models/File');
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
    var file = new File(fs.readFileSync(storePath));

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

    //
    //// ActionCase identifier,
    //// defaults to actionName
    //var actionCaseIdentifier = actionName;
    //
    //// If imported with * as x, get x and use for actionCaseIdentifier
    //if (n.ImportNamespaceSpecifier.check(specifiers[0])) {
    //  actionCaseIdentifier = specifiers[0].id.name + '.' + actionName;
    //}
    //
    //// Create action case
    //var actionCase = b.switchCase(
    //  b.identifier(actionCaseIdentifier),
    //  [
    //    b.breakStatement()
    //  ]
    //);
    //actionCase.comments = [b.line(' Put your action specific logic here')];
    //
    //// Find switch statement
    //var switchStatement = null;
    //var alreadyHasSwitch = false;
    //
    //recast.visit(dispatchToken, {
    //
    //  visitSwitchStatement: function(switchExpr) {
    //    switchStatement = switchExpr;
    //    this.traverse(switchStatement);
    //  },
    //
    //  visitSwitchCase: function(switchCase) {
    //    var test = switchCase.get('test').value;
    //    if (n.Identifier.check(test) && test.name === actionName) {
    //      alreadyHasSwitch = true;
    //      this.abort();
    //    }
    //    return false;
    //  },
    //
    //  visitMemberExpression: function(memberExpression) {
    //    var object = memberExpression.get('object').value.name;
    //    var prop = memberExpression.get('property').value.name;
    //    if ((object + '.' + prop) === actionCaseIdentifier) {
    //      alreadyHasSwitch = true;
    //      this.abort();
    //    }
    //    return false;
    //  }
    //
    //});
    //
    //if (!switchStatement) {
    //  return Promise.reject('No switch statement present in your app. Please check your store file');
    //}
    //
    //if (!alreadyHasSwitch) {
    //  switchStatement.get('cases').unshift(actionCase);
    //}

    return new Promise.fromNode(function(callback) {
      var modifiedElement = recast.print(file.ast).code;
      fs.writeFile(storePath, modifiedElement, callback);
    });

  }

};