/*
 * @fileOverview
 * @author: Mike Grabowski (@grabbou)
 */

'use strict';

var recast = require('recast');
var n = recast.types.namedTypes;
var b = recast.types.builders;

module.exports = ImportDeclaration;

function ImportDeclaration(declaration) {
  this.body = declaration.value ? declaration.value : declaration;
  this.specifiers = this.body.specifiers;
}

ImportDeclaration.prototype.isNamespaceImport = function() {
  return n.ImportNamespaceSpecifier.check(this.specifiers[0]);
};

ImportDeclaration.prototype.importsVariable = function(variableName) {

  // If namespace import (* from..), assume it's already imported
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

ImportDeclaration.prototype.importVariable = function(variableName) {
  var newSpecifier = b.importSpecifier(
    b.identifier(variableName)
  );
  this.specifiers.push(newSpecifier);
};