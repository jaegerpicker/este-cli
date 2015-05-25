/*
 * @fileOverview
 * @author: Mike Grabowski (@grabbou)
 */

'use strict';

var camelCase = require('camel-case');
var recast = require('recast');
var n = recast.types.namedTypes;
var b = recast.types.builders;
var Promise = require('bluebird');
var path = require('path');
var fs = require('fs');

module.exports = {

  skipExistingFiles: true,

  afterInstall: function(options) {
    var statePath = path.join(options.serverFolder, 'initialstate.js');
    var data = recast.parse(fs.readFileSync(statePath).toString());
    var blueprintName = camelCase(options.blueprintName);

    var states = null;

    // Get states by assuming they are exported from initialstate.js file
    recast.visit(data.program.body, {
      visitExportDeclaration: function(data) {
        states = data;
        return false;
      }
    });

    if (!states) {
      return Promise.reject('No export declaration in initialstate.js. Please check your file');
    }

    var containsStateAlready = false;

    recast.visit(states, {

      // Traverse only top-level expression statement
      visitObjectExpression: function(object) {
        if(n.ExportDeclaration.check(object.parent.node)) {
          this.traverse(object);

          if (!containsStateAlready) {
            var stateProperty = b.property(
              'init',
              b.identifier(blueprintName),
              b.objectExpression([])
            );
            object.get('properties').push(stateProperty);
          }
        }
        return false;
      },

      // Go deeper on every property to get identifier
      visitProperty: function(property) {
        this.traverse(property);
      },

      // Compare identifiers with a new name to ensure it's unique
      visitIdentifier: function(identifier) {
        if (identifier.get('name').value === blueprintName) {
          containsStateAlready = true;
          this.abort();
        }
        return false;
      }
    });

    return new Promise.fromNode(function(callback) {
      var modifiedElement = recast.print(data).code;
      fs.writeFile(statePath, modifiedElement, callback);
    });

  }
};