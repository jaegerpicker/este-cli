/*
 * @fileOverview
 * @author: Mike Grabowski (@grabbou)
 */

'use strict';

var camelCase = require('camel-case');
var pascalCase = require('pascal-case');

module.exports = {
  description: 'Generates new element',

  args: [{
    type: String,
    name: 'elementName',
    property: 'blueprintElement',
    required: true
  }],

  mapFileTokens: function(options) {
    return {
      __element__: camelCase(options.blueprintElement)
    }  
  },
  
  locals: function(file, options) {
    return {
      className: pascalCase(options.blueprintElement),
      camelName: camelCase(options.blueprintElement)
    }
  }
  
};