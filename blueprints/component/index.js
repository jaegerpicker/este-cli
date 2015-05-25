/*
 * @fileOverview
 * @author: Mike Grabowski (@grabbou)
 */

'use strict';

var camelCase = require('camel-case');

module.exports = {
  description: 'Generates new component',
  locals: function(file, options) {
    return {
      camelName: camelCase(options.blueprintName)
    }
  }
};