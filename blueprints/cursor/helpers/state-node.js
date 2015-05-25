/*
 * @fileOverview
 * @author: Mike Grabowski (@grabbou)
 */

'use strict';

var builders = require('recast').types.builders;

module.exports = function buildNode(options) {
  return builders.property(
    'init',
    builders.identifier(options.name),
    builders.objectExpression([])
  );
};