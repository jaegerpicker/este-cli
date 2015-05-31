/*
 * @fileOverview
 * @author: Mike Grabowski (@grabbou)
 */

'use strict';

var recast = require('recast');
var ImportDeclaration = require('./importDeclaration');
var SwitchStatement = require('./switchStatement');
var ObjectExpression = require('./objectExpression');
var b = recast.types.builders;
var fs = require('fs');

module.exports = File;

function File(filestring) {
  this.ast = recast.parse(filestring);
  this.body = this.ast.program.body;
}

File.load = function(path) {
  var fileBody = fs.readFileSync(path);
  return new File(fileBody.toString());
};

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

File.prototype.getObjectExpression = function() {
  var objectExpression = null;

  recast.visit(this.body, {
    visitObjectExpression: function(data) {
      objectExpression = new ObjectExpression(data);
      this.abort();
    }
  });

  return objectExpression;
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

File.prototype.getSwitchStatement = function(elementToTraverse) {
  var switchStatement = null;

  recast.visit(elementToTraverse || this.body, {

    visitSwitchStatement: function(switchStmt) {
      switchStatement = new SwitchStatement(switchStmt);
      return false;
    }

  });

  return switchStatement;
};

File.prototype.print = function() {
  return recast.print(this.ast).code;
};