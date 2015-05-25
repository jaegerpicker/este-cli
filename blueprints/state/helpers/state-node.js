/*
 * @fileOverview
 * @author: Mike Grabowski (@grabbou)
 */

'use strict';

var builders = require('recast').types.builders;
var camelCase = require('camel-case');

module.exports = function buildNode(options) {
  return builders.property(
    'init',
    builders.identifier(camelCase(options.name)),
    builders.objectExpression([])
  );
};