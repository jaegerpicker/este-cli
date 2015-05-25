/*
 * @fileOverview
 * @author: Mike Grabowski (@grabbou)
 */

'use strict';

var recast = require('recast');

module.exports = function getCursor(data) {

  var cursors = null;

  recast.visit(data.program.body, {
    visitExportDeclaration: function(data) {
      cursors = data;
      return false;
    }
  });

  return cursors;
};