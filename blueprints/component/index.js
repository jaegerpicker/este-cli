/*
 * @fileOverview
 * @author: Mike Grabowski (@grabbou)
 */

'use strict';

var camelCase = require('camel-case');

module.exports = {
  description: 'Generates new component',
  mapTemplateVariables: function(file, options) {
    return {
      camelName: camelCase(options.blueprintName)
    }
  }
};