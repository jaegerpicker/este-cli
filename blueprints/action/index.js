/*
 * @fileOverview
 * @author: Mike Grabowski (@grabbou)
 */

'use strict';

var paramName = require('param-case');
var camelCase = require('camel-case');

module.exports = {
  skipExistingFiles: true,
  description: 'Generates new action',
  locals: function(file, options) {
    return {
      camelName: camelCase(options.blueprintName)
    }
  }
};