/*
 * @fileOverview
 * @author: Mike Grabowski (@grabbou)
 */

'use strict';

var camelCase = require('camel-case');
var recast = require('recast');
var b = recast.types.builders;
var Promise = require('bluebird');
var path = require('path');
var fs = require('fs');

module.exports = {

  skipExistingFiles: true,

  afterInstall: function(options) {
    var statePath = path.join(options.rootFolder, 'state.js');
    var data = recast.parse(fs.readFileSync(statePath).toString());
    var blueprintName = camelCase(options.blueprintName) + 'Cursor';

    var elements = null;
    var state = null;

    // Get all elements in a program
    recast.visit(data, {
      visitProgram: function(program) {
        elements = program.get('elements');
        state = program.scope.getBindings().state;
        return false;
      }
    });

    if (!elements) {
      return Promise.reject('Cursor file seem to be invalid. Please check if it contains at least one declaration');
    }

    if (!state) {
      return Promise.reject('No state is imported from lib. Please add it before running this generator again');
    }

    var containsCursorAlready = false;

    recast.visit(data.program.body, {

      // Visit all export declarations to check against duplicates
      visitExportDeclaration: function(exportDeclaration) {
        this.traverse(exportDeclaration);
      },

      // Check all export const declarations
      visitVariableDeclaration: function(variable) {
        if (variable.get('kind').value === 'const') {
          this.traverse(variable);
        }
        return false;
      },

      // Look up declarator identifier
      visitVariableDeclarator: function(declarator) {
        if (declarator.get('id').value.name === blueprintName) {
          containsCursorAlready = true;
          this.abort();
        }
        return false;
      }

    });

    console.log(containsCursorAlready);

    if (containsCursorAlready) {

    }

    //
    //
    //
    //recast.visit(states, {
    //
    //  // Traverse every expression statement
    //  visitObjectExpression: function(object) {
    //    this.traverse(object);
    //    if (!containsStateAlready) {
    //      var stateProperty = b.property(
    //        'init',
    //        b.identifier(blueprintName),
    //        b.objectExpression([])
    //      );
    //      object.get('properties').push(stateProperty);
    //    }
    //  },
    //
    //  // Go deeper on every property to get identifier
    //  visitProperty: function(property) {
    //    this.traverse(property);
    //  },
    //
    //  // Compare identifiers with a new name to ensure it's unique
    //  visitIdentifier: function(identifier) {
    //    if (identifier.get('name').value === blueprintName) {
    //      containsStateAlready = true;
    //      this.abort();
    //    }
    //    return false;
    //  }
    //});
    //
    //return new Promise.fromNode(function(callback) {
    //  var modifiedElement = recast.print(data).code;
    //  fs.writeFile(statePath, modifiedElement, callback);
    //});

  }
};