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
    var data = recast.parse(fs.readFileSync(storePath).toString());

    // Find dispatchToken export declaration
    // Check if actions are imported
    var dispatchToken = null;
    var actionImport = null;

    recast.visit(data.program.body, {

      visitImportDeclaration: function(imports) {
        if (imports.get('source').value.value === './actions') {
          actionImport = imports;
        }
        return false;
      },

      visitExportDeclaration: function(exports) {
        this.traverse(exports);
      },

      visitVariableDeclaration: function(variable) {
        this.traverse(variable);
      },

      visitVariableDeclarator: function(declarator) {
        if (declarator.get('id').value.name === 'dispatchToken') {
          dispatchToken = declarator;
          this.abort();
        }
        return false;
      }

    });

    if (!dispatchToken) {
      return Promise.reject('No dispatchToken is exported from your app. Please check your store file');
    }

    var specifiers = null;

    // Import actions if not yet done using ImportNamespaceSpecifiers
    // @TODO check for `action` collision
    if (!actionImport) {

      actionImport = b.importDeclaration(
        [b.importNamespaceSpecifier(
          b.identifier('actions')
        )],
        b.literal('./actions')
      );

      data.program.body.unshift(actionImport);

      specifiers = actionImport.specifiers;

    } else {
      specifiers = actionImport.get('specifiers').value;
    }

    // If not import * from actions,
    // we need to add our action to objects
    // it will be the first one in the array
    if (!n.ImportNamespaceSpecifier.check(specifiers[0])) {
      var hasAlreadyImportedAction = false;

      recast.visit(specifiers, {

        visitImportSpecifier: function(specifier) {
          this.traverse(specifier);
        },

        visitIdentifier: function(identifier) {
          if (identifier.value.name === actionName) {
            hasAlreadyImportedAction = true;
            this.abort();
          }
          return false;
        }

      });

      // Add action if not yet imported
      if (!hasAlreadyImportedAction) {
        var newSpecifier = b.importSpecifier(
          b.identifier(actionName)
        );
        specifiers.push(newSpecifier);
      }

    }

    // ActionCase identifier,
    // defaults to actionName
    var actionCaseIdentifier = actionName;

    // If imported with * as x, get x and use for actionCaseIdentifier
    if (n.ImportNamespaceSpecifier.check(specifiers[0])) {
      actionCaseIdentifier = specifiers[0].id.name + '.' + actionName;
    }

    // Create action case
    var actionCase = b.switchCase(
      b.identifier(actionCaseIdentifier),
      [
        b.breakStatement()
      ]
    );
    actionCase.comments = [b.line(' Put your action specific logic here')];

    // Find switch statement
    var switchStatement = null;
    var alreadyHasSwitch = false;

    recast.visit(dispatchToken, {

      visitSwitchStatement: function(switchExpr) {
        switchStatement = switchExpr;
        this.traverse(switchStatement);
      },

      visitSwitchCase: function(switchCase) {
        var test = switchCase.get('test').value;
        if (n.Identifier.check(test) && test.name === actionName) {
          alreadyHasSwitch = true;
          this.abort();
        }
        return false;
      },

      visitMemberExpression: function(memberExpression) {
        var object = memberExpression.get('object').value.name;
        var prop = memberExpression.get('property').value.name;
        if ((object + '.' + prop) === actionCaseIdentifier) {
          alreadyHasSwitch = true;
          this.abort();
        }
        return false;
      }

    });

    if (!switchStatement) {
      return Promise.reject('No switch statement present in your app. Please check your store file');
    }

    if (!alreadyHasSwitch) {
      switchStatement.get('cases').unshift(actionCase);
    }

    return new Promise.fromNode(function(callback) {
      var modifiedElement = recast.print(data).code;
      fs.writeFile(storePath, modifiedElement, callback);
    });

  }

};