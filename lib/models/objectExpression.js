/*
 * @fileOverview
 * @author: Mike Grabowski (@grabbou)
 */

'use strict';

var recast = require('recast');
var n = recast.types.namedTypes;
var b = recast.types.builders;

module.exports = ObjectExpression;

function ObjectExpression(declaration) {
  this.body = declaration;
}

ObjectExpression.prototype.hasProperty = function(propertyName) {
  var hasProperty = false;

  recast.visit(this.body, {

    // Compare identifiers with a new name to ensure it's unique
    visitIdentifier: function(identifier) {
      if (identifier.get('name').value === propertyName) {
        hasProperty = true;
        this.abort();
      }
      return false;
    }
  });

  return hasProperty;
};

ObjectExpression.prototype.addProperty = function(propertyName) {
  var stateProperty = b.property(
    'init',
    b.identifier(propertyName),
    b.objectExpression([])
  );
  this.body.get('properties').push(stateProperty);
};