/*
 * @fileOverview
 * @author: Mike Grabowski (@grabbou)
 */

'use strict';

var recast = require('recast');

/**
 * Gets action node to insert next node after.
 * @param data
 * @returns {*}
 */
module.exports = function getAction(data) {

  var func = null;

  recast.visit(data.program.body, {
    visitExpressionStatement: function(data) {
      if (data.value.expression && data.value.expression.callee) {
        var callee = data.value.expression.callee;
        if (callee.name === 'setToString') {
          func = data;
        }
      }
      return false;
    }
  });

  return func;
};