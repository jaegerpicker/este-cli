/*
 * @fileOverview
 * @author: Mike Grabowski (@grabbou)
 */

'use strict';

var recast = require('recast');
var n = recast.types.namedTypes;
var b = recast.types.builders;

module.exports = SwitchStatement;

/**
 * Creates new switch statement
 * @param declaration
 * @constructor
 */
function SwitchStatement(declaration) {
  this.body = declaration;
}

/**
 * Checks if switch case is present in the current switch statement
 * by comparing the given identifier with the present ones
 * @method hasSwitchCase
 * @param {String} identifierName
 * @returns {Boolean} true, if there was a match, false otherwise
 */
SwitchStatement.prototype.hasSwitchCase = function(identifierName) {
  return !!this.getSwitchCase(identifierName);
};

/**
 * Gets switch case that matches given identifier
 * @method getSwitchCase
 * @param {String} identifierName
 * @returns {SwitchCase}
 */
SwitchStatement.prototype.getSwitchCase = function(identifierName) {

  var foundSwitchCase = null;

  recast.visit(this.body, {

    visitSwitchCase: function(switchCase) {
      var test = switchCase.get('test').value;
      if (n.Identifier.check(test) && test.name === identifierName) {
        foundSwitchCase = switchCase;
      }
      if (n.MemberExpression.check(test)) {
        var object = test.object.name;
        var prop = test.property.name;
        if ((object + '.' + prop) === identifierName) {
          foundSwitchCase = switchCase;
        }
      }
      if (foundSwitchCase) {
        this.abort();
      }
      return false;
    }

  });

  return foundSwitchCase;

};

/**
 * Adds a new empty switch case
 * @method addSwitchCase
 * @param {String} identifierName
 */
SwitchStatement.prototype.addSwitchCase = function(identifierName) {
  var actionCase = b.switchCase(
    b.identifier(identifierName),
    [b.breakStatement()]
  );

  this.body.get('cases').unshift(actionCase);
};