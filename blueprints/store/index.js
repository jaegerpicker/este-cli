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
  afterInstall: function(options) {
    return Blueprint.load('cursor').install(options);
  }
};