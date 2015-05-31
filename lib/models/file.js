/*
 * @fileOverview
 * @author: Mike Grabowski (@grabbou)
 */

'use strict';

var recast = require('recast');
var ImportDeclaration = require('./importDeclaration');
var b = recast.types.builders;

module.exports = File;

function File(filebody) {
  this.ast = recast.parse(filebody.toString());
  this.body = this.ast.program.body;
}

File.prototype.getVariable = function(variableName) {

  var variableDeclarator = null;

  recast.visit(this.body, {

    visitVariableDeclarator: function(declarator) {
      if (declarator.get('id').value.name === variableName) {
        variableDeclarator = declarator;
        this.abort();
      }
      return false;
    }

  });

  return variableDeclarator;

};

File.prototype.getImportDeclaration = function(fileName) {

  var importDeclaration = null;

  recast.visit(this.body, {

    visitImportDeclaration: function(imports) {
      if (imports.get('source').value.value === fileName) {
        importDeclaration = new ImportDeclaration(imports);
        this.abort();
      }
      return false;
    }

  });

  return importDeclaration;

};

File.prototype.addImportDeclaration = function(fileName, path) {

  var importDeclaration = b.importDeclaration(
    [b.importNamespaceSpecifier(
      b.identifier(fileName)
    )],
    b.literal(path)
  );

  this.body.unshift(importDeclaration);

  return new ImportDeclaration(importDeclaration);

};