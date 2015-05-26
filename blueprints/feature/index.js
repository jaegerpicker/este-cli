/*
 * @fileOverview
 * @author: Mike Grabowski (@grabbou)
 */

'use strict';

var Promise = require('bluebird');
var Blueprint = require('../../lib/models/blueprint');

module.exports = {

  description: 'Generates new feature',

  beforeInstall: function(options) {
    return Promise.all([
      Blueprint.load('store').install(options),
      Blueprint.load('action').install(options),
      Blueprint.load('page').install(options)
    ]);
  }

};