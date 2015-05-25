/*
 * @fileOverview
 * @author: Mike Grabowski (@grabbou)
 */

'use strict';

var _ = require('lodash');

module.exports = function hasCursor(cursors, node) {
  return _.find(cursors.value.declaration.properties, function(property) {
    return property.key.name === node.key.name;
  });
};