/*
 * @fileOverview
 * @author: Mike Grabowski (@grabbou)
 */

'use strict';

var Promise = require('bluebird');
var Blueprint = require('../../lib/models/blueprint');

module.exports = {

  description: 'Generates new store',

  // Create state/cursor with appropriate elements
  beforeInstall: function(options) {
    return Promise.all([
      Blueprint.load('state').install(options),
      Blueprint.load('cursor').install(options)
    ]);
  }

};