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
var _ = require('lodash');

module.exports = File;

/**
 * Creates new file
 * @param {String} filestring content of the file
 * @constructor
 */
function File(filestring) {
  this.ast = recast.parse(filestring);
  this.body = this.ast.program.body;
}

/**
 * Factory method that loads file from the filesystem
 * @method load
 * @param {String} path location to file on the disk
 * @returns {File} newly created instance
 */
File.load = function(path) {
  var fileBody = fs.readFileSync(path);
  return new File(fileBody.toString());
};

/**
 * Searches for the method invocation by comparing the given
 * methodName with callee name
 * @param {String} methodName
 * @returns {Object}
 */
File.prototype.getMethodByInvocation = function(methodName) {
  var method = null;

  recast.visit(this.body, {

    // Check if setToString is a callee name in call expression
    visitCallExpression: function(call) {
      if (call.get('callee').value.name === methodName) {
        method = call.parent;
      }
      return false;
    }
  });

  return method;
};

/**
 * Gets function declaration by comparing ots identifier with
 * a functionName given
 * @method getFunctionDeclaration
 * @param {String} functionName
 * @returns {FunctionDeclaration}
 */
File.prototype.getFunctionDeclaration = function(functionName) {
  var functionDeclaration = null;

  recast.visit(this.body, {

    visitFunctionDeclaration: function(declaration) {
      if (declaration.get('id').value.name === functionName) {
        functionDeclaration = declaration;
      }
      return false;
    }

  });

  return functionDeclaration;
};

/**
 * Checks if variable is present in the topmost scope
 * @method hasVariableInScope
 * @param {String} variableName
 * @returns {Boolean} true, if variable is defined, false otherwise
 */
File.prototype.hasVariableInScope = function(variableName) {

  var hasVariable = false;

  recast.visit(this.ast, {

    visitProgram: function(program) {
      if (program.scope.getBindings()[variableName]) {
        hasVariable = true;
      }
      this.abort();
    }

  });

  return hasVariable;
};

/**
 * Gets variable by comparing variable declarator identifier with
 * a variableName given
 * @method getVariable
 * @param {String} variableName
 * @returns {VariableDeclarator|null} VariableDeclarator when match found, null otherwise
 */
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

/**
 * Gets first expression in a given element
 * Creates ObjectExpression instance with additional helper methods
 * @method getObjectExpression
 * @param {Object?} element if undefined, body of the file is searched instead
 * @returns {ObjectExpression|null} ObjectExpression object when match found, null otherwise
 */
File.prototype.getObjectExpression = function(element) {
  var objectExpression = null;

  recast.visit(element || this.body, {
    visitObjectExpression: function(data) {
      objectExpression = new ObjectExpression(data);
      this.abort();
    }
  });

  return objectExpression;
};

/**
 * Gets import declaration. Checks if a given fileName is imported
 * Creates an ImportDeclaration instance with additional helper methods
 * @method getImportDeclaration
 * @param {String} fileName
 * @returns {ImportDeclaration|null} ImportDeclaration when match found, false otherwise
 */
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

/**
 * Adds new namespace import declaration at the top of the file, for example:
 * `import * as ${identifier} from ${path}`
 * @method addImportDeclaration
 * @param {String} identifier
 * @param {String} path
 * @returns {ImportDeclaration} newly created import declaration
 */
File.prototype.addImportDeclaration = function(identifier, path) {
  var importDeclaration = b.importDeclaration(
    [b.importNamespaceSpecifier(
      b.identifier(identifier)
    )],
    b.literal(path)
  );

  this.body.unshift(importDeclaration);

  return new ImportDeclaration(importDeclaration);
};

/**
 * Gets the first switch statement in the given element
 * Creates SwitchStatement instance with additional helper methods
 * @method getSwitchStatement
 * @param {Object?} elementToTraverse when null, the whole body is searched
 * @returns {SwitchStatement}
 */
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

/**
 * Proxy method to recast that prints the file
 * @method print
 * @returns {String}
 */
File.prototype.print = function() {
  return recast.print(this.ast).code;
};

/**
 * Prepends code at the beginning of the given element
 * If element is not present, the code is prepended at the
 * beginning of the element
 * @method prependCode
 * @param {Object|String} element, can be skipped
 * @param {String?} string code to parse and prepend
 */
File.prototype.prependCode = function(element, string) {
  if (_.isString(element)) {
    string = element;
    element = this.body;
  }
  var program = recast.parse(string).program;
  program.body.forEach(function(el) {
    if (_.isArray(element)) {
      element.unshift(el);
    } else {
      element.insertBefore(el);
    }
  });
};

/**
 * Appends code at the end of the given element
 * If element is not present, the code is appended at the end
 * of the program
 * @method appendCode
 * @param {Object|String} element, can be skipped
 * @param {String?} string code to parse and prepend
 */
File.prototype.appendCode = function(element, string) {
  if (_.isString(element)) {
    string = element;
    element = this.body;
  }
  var program = recast.parse(string).program;
  program.body.forEach(function(el) {
    if (_.isArray(element)) {
      element.push(el);
    } else {
      element.insertAfter(el);
    }
  });
};