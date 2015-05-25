/*
 * @fileOverview
 * @author: Mike Grabowski (@grabbou)
 */

'use strict';

var Promise = require('bluebird');
var recast = require('recast');
var b = recast.types.builders;
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

    // Generator was run with 3 arguments instead of 3, skip afterInstall
    if (!options.blueprintAction) return;

    var actionPath = path.join(options.rootFolder, options.blueprintName, 'actions.js');
    var data = recast.parse(fs.readFileSync(actionPath).toString());

    // Assume setToString does not exist yet
    var setToString = null;

    recast.visit(data.program.body, {

      // Traverse every expression statement
      visitExpressionStatement: function(statement) {
        this.traverse(statement);
      },

      // Check if setToString is a callee name in call expression
      visitCallExpression: function(call) {
        if (call.get('callee').value.name === 'setToString') {
          setToString = call.parent;
          this.abort();
        }
        return false;
      }
    });

    if (!setToString) {
      return Promise.reject('Couldn\'t find `setToString` method. Make sure it exists');
    }

    // Add new export action just before setToString
    var node = b.exportDeclaration(
      false,
      b.functionDeclaration(
        b.identifier(options.blueprintAction),
        [],
        b.blockStatement([])
      )
    );

    setToString.insertBefore(node);

    // Check if action is already defined in setToString
    var containsActionAlready = false;

    recast.visit(setToString, {

      // Go deeper in object expression (our root)
      visitObjectExpression: function(object) {
        this.traverse(object);

        // After done with traversing, check the flag and append the item
        if (!containsActionAlready) {
          var actionProperty = b.property(
            'init',
            b.identifier(options.blueprintAction),
            b.identifier(options.blueprintAction)
          );
          actionProperty.shorthand = true;
          object.get('properties').push(actionProperty);
        }
      },

      // Go deeper on every property to get identifier
      visitProperty: function(property) {
        this.traverse(property);
      },

      // Compare identifiers with a new name to ensure it's unique
      visitIdentifier: function(identifier) {
        if (identifier.get('name').value === options.blueprintAction) {
          containsActionAlready = true;
          this.abort();
        }
        return false;
      }
    });

    return new Promise.fromNode(function(callback) {
      var modifiedElement = recast.print(data).code;
      fs.writeFile(actionPath, modifiedElement, callback);
    });
  }
};