/*
 * @fileOverview
 * @author: Mike Grabowski (@grabbou)
 */

'use strict';

var recast = require('recast');
var n = recast.types.namedTypes;
var b = recast.types.builders;

module.exports = SwitchStatement;

function SwitchStatement(declaration) {
  this.body = declaration;
}

SwitchStatement.prototype.hasSwitchCase = function(identifierName) {

  var alreadyHasSwitch = false;

  recast.visit(this.body, {

    visitSwitchCase: function(switchCase) {
      var test = switchCase.get('test').value;
      if (n.Identifier.check(test) && test.name === identifierName) {
        alreadyHasSwitch = true;
        this.abort();
      }
      return false;
    },

    visitMemberExpression: function(memberExpression) {
      var object = memberExpression.get('object').value.name;
      var prop = memberExpression.get('property').value.name;
      if ((object + '.' + prop) === identifierName) {
        alreadyHasSwitch = true;
        this.abort();
      }
      return false;
    }

  });

  return alreadyHasSwitch;

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