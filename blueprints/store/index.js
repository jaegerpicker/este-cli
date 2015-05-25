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
  locals: function(file, options) {
    return {
      camelName: camelCase(options.blueprintName)
    }
  },
  afterInstall: function(options) {
    return Promise.all([
      Blueprint.load('state').install(options),
      Blueprint.load('cursor').install(options)
    ]);
  }
};