/*
 * @fileOverview
 * @author: Mike Grabowski (@grabbou)
 */

'use strict';

var camelCase = require('camel-case');

module.exports = {
  description: 'Generates new store',
  mapTemplateVariables: function(file, options) {
    return {
      camelName: camelCase(options.blueprintName)
    }
  }
};