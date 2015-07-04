/*
 * @fileOverview
 * @author: Mike Grabowski (@grabbou)
 */

'use strict';

var Promise = require('bluebird');
var Blueprint = require('../../lib/models/blueprint');
var fs = require('fs');
var recast = require('recast');
var b = recast.types.builders;
var path = require('path');
var pascalCase = require('pascal-case');
var pathCase = require('path-case');

module.exports = {

  skipExistingFiles: true,

  description: 'Generates new route',

  afterInstall: function(options) {

    var storePath = path.join(options.rootFolder, 'routes.js');
    var data = recast.parse(fs.readFileSync(storePath).toString());

    var importPath = './pages/' + options.blueprintName + '.react';

    // Find topmost route
    var topMostRoute = null;

    recast.visit(data.program.body, {

      // Top most route will be the first JSXElement on the root level
      visitJSXElement: function(jsxElement) {
        topMostRoute = jsxElement;
        return false;
      }

    });

    if (!topMostRoute) {
      return Promise.reject('No routes defined. Make sure at least topmost route is defined');
    }

    // Check if page is already imported
    var pageImport = false;

    recast.visit(data.program.body, {

      visitImportDeclaration: function(imports) {
        if (imports.get('source').value.value === importPath) {
          pageImport = imports;
          this.abort();
        }
        return false;
      }

    });

    var specifiers = null;

    // If not, add import statement
    if (!pageImport) {

      var importStatement = b.importDeclaration(
        [b.importDefaultSpecifier(
          b.identifier(pascalCase(options.blueprintName))
        )],
        b.literal(importPath)
      );

      data.program.body.unshift(importStatement);

      specifiers = importStatement.specifiers;

    } else {
      specifiers = pageImport.get('specifiers').value;
    }

    // Get class name from import to refer in a route
    var className = specifiers[0].id.name;

    // Check if route is already defined
    var alreadyHasRoute = false;

    recast.visit(topMostRoute, {

      // Check all {} expression in JSX to find {className}
      visitJSXExpressionContainer: function(expression) {
        if (expression.get('expression').value.name === className) {
          alreadyHasRoute = true;
          this.abort();
        }
        return false;
      }

    });

    // Create page node
    // @TODO support nested elements
    // @TODO support specifying path
    var node = b.jsxElement(
      b.jsxOpeningElement(
        b.jsxIdentifier('Route'),
        [
          b.jsxAttribute(
            b.jsxIdentifier("handler"),
            b.jsxExpressionContainer(
              b.identifier(className)
            )
          ),
          b.jsxAttribute(
            b.jsxIdentifier("path"),
            b.literal(pathCase(options.blueprintName))
          )
        ],
        true
      )
    );

    if (!alreadyHasRoute) {
      topMostRoute.get('children').push(node, '\n');
    }

    return new Promise.fromNode(function(callback) {
      var modifiedElement = recast.print(data).code;
      fs.writeFile(storePath, modifiedElement, callback);
    });

  }

};