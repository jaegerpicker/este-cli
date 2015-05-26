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

  alias: 'gcu',

  description: 'Generates new cursor',

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
        elements = program.get('body');
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

    recast.visit(elements, {

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

    // Add cursor if not yet present
    if (!containsCursorAlready) {
      var cursor = b.exportDeclaration(
        false,
        b.variableDeclaration(
          'const',
          [b.variableDeclarator(
            b.identifier(blueprintName),
            b.callExpression(
              b.memberExpression(
                b.identifier('state'),
                b.identifier('cursor'),
                false
              ),
              [b.arrayExpression([
                b.literal(blueprintName)
              ])]
            )
          )]
        )
      );
      elements.push(cursor);
    }

    return new Promise.fromNode(function(callback) {
      var modifiedElement = recast.print(data).code;
      fs.writeFile(statePath, modifiedElement, callback);
    });

  }
};