/*
 * @fileOverview
 * @author: Mike Grabowski (@grabbou)
 */

'use strict';

var camelCase = require('camel-case');
var Promise = require('bluebird');
var Blueprint = require('../../lib/models/blueprint');

module.exports = {
  description: 'Generates new store',
  mapTemplateVariables: function(file, options) {
    return {
      camelName: camelCase(options.blueprintName)
    }
  },
  afterInstall: function(options) {
    return Blueprint.load('cursor').install(options);
  }
};