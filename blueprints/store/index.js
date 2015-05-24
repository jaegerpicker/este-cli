/*
 * @fileOverview
 * @author: Mike Grabowski (@grabbou)
 */

'use strict';

var camelCase = require('camel-case');
var Promise = require('bluebird');

module.exports = {
  description: 'Generates new store',
  afterInstall: function(options) {
    return Promise.resolve();
  }
};