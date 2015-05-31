/*
 * @fileOverview
 * @author: Mike Grabowski (@grabbou)
 */

'use strict';

var recast = require('recast');
var n = recast.types.namedTypes;
var b = recast.types.builders;

module.exports = ObjectExpression;

/**
 * Creates new object expression
 * @param {Object} declaration
 * @constructor
 */
function ObjectExpression(declaration) {
  this.body = declaration;
}

/**
 * Checks if there's a property in a given object
 * @param {String} propertyName
 * @returns {Boolean} true, if there was a match, false otherwise
 */
ObjectExpression.prototype.hasProperty = function(propertyName) {
  return !!this.getProperty(propertyName);
};

/**
 * Gets property from the object
 * @param {String} propertyName
 * @returns {Property}
 */
ObjectExpression.prototype.getProperty = function(propertyName) {
  var property = null;

  recast.visit(this.body, {

    // Compare identifiers with a new name to ensure it's unique
    visitIdentifier: function(identifier) {
      if (identifier.get('name').value === propertyName) {
        property = identifier.parentPath;
        this.abort();
      }
      return false;
    }
  });

  return property;
};

/**
 * Adds new property to the object
 * @param {String} propertyName
 * @param {Boolean?} isShort when present, the property is shortened as per ES6 spec
 * @returns {Property} newly created element
 */
ObjectExpression.prototype.addProperty = function(propertyName, isShort) {
  var property = b.property(
    'init',
    b.identifier(propertyName),
    b.objectExpression([])
  );
  property.shorthand = isShort;
  this.body.get('properties').push(property);
  return property;
};