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

SwitchStatement.prototype.hasSwitchCase = function(identifierName) {
  return !!this.getSwitchCase(identifierName);
};

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

SwitchStatement.prototype.addSwitchCase = function(identifierName) {
  var actionCase = b.switchCase(
    b.identifier(identifierName),
    [
      b.breakStatement()
    ]
  );
  actionCase.comments = [b.line(' Put your action specific logic here')];

  this.body.get('cases').unshift(actionCase);
};