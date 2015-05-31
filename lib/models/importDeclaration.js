/*
 * @fileOverview
 * @author: Mike Grabowski (@grabbou)
 */

'use strict';

var recast = require('recast');
var b = recast.types.builders;
var n = recast.types.namedTypes;

module.exports = ImportDeclaration;

/**
 * Creates new ImportDeclaration
 * @param {Object} declaration
 * @constructor
 */
function ImportDeclaration(declaration) {
  this.body = declaration.value ? declaration.value : declaration;
  this.specifiers = this.body.specifiers;
}

/**
 * Checks if a given import declaration uses namespace
 * E.g. import * as actions from './actions'
 * @method isNamespaceImport
 * @returns {Boolean} true, if uses, false otherwise
 */
ImportDeclaration.prototype.isNamespaceImport = function() {
  return n.ImportNamespaceSpecifier.check(this.specifiers[0]);
};

/**
 * Checks if variable is imported in a given declaration
 * Returns true if namespace import or if listed in the values list
 * @method importsVariable
 * @param {String} variableName
 * @returns {boolean} true, if imported, false otherwise
 */
ImportDeclaration.prototype.importsVariable = function(variableName) {

  if (this.isNamespaceImport()) {
    return true;
  }

  var hasAlreadyImportedAction = false;

  recast.visit(this.specifiers, {

    visitIdentifier: function(identifier) {
      if (identifier.value.name === variableName) {
        hasAlreadyImportedAction = true;
        this.abort();
      }
      return false;
    }

  });

  return hasAlreadyImportedAction;

};

/**
 * Adds variable to imported list
 * Does nothing if namespace import is present
 * @method importVariable
 * @param {String} variableName
 */
ImportDeclaration.prototype.importVariable = function(variableName) {
  if (this.isNamespaceImport()) return;
  var newSpecifier = b.importSpecifier(
    b.identifier(variableName)
  );
  this.specifiers.push(newSpecifier);
};

/**
 * Gets variable identifier from import declaration
 * For example:
 * - When `import * as actions from './actions', it returns `actions.${variableName}`
 * - When `import {one, two, three] from './actions', it returns variableName
 * @param {String} variableName
 * @returns {String}
 */
ImportDeclaration.prototype.getVariableIdentifier = function(variableName) {
  if (this.isNamespaceImport()) {
    return this.specifiers[0].id.name + '.' + variableName;
  } else {
    return variableName;
  }
};