/*
 * @fileOverview
 * @author: Mike Grabowski (@grabbou)
 */

'use strict';

var paramName = require('param-case');
var camelCase = require('camel-case');
var Blueprint = require('../../lib/models/blueprint');

module.exports = {
  description: 'Generates new page',
  locals: function(file, options) {
    return {
      cssName: paramName(options.blueprintName)
    }
  },
  afterInstall: function(options) {
    return Blueprint.load('route').install(options);
  }
};