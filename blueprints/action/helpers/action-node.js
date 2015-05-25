/*
 * @fileOverview
 * @author: Mike Grabowski (@grabbou)
 */

'use strict';

var b = require('recast').types.builders;
var camelCase = require('camel-case');

module.exports = function buildNode(options) {
  return b.exportDeclaration(
    false,
    b.functionDeclaration(
      b.identifier(camelCase(options.name)),
      [],
      b.blockStatement([])
  ));
};