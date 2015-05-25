/*
 * @fileOverview
 * @author: Mike Grabowski (@grabbou)
 */

'use strict';

var paramName = require('param-case');
var camelCase = require('camel-case');

module.exports = {
  description: 'Generates new page',
  locals: function(file, options) {
    return {
      cssName: paramName(options.blueprintName)
    }
  }
};