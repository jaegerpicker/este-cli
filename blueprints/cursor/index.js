/*
 * @fileOverview
 * @author: Mike Grabowski (@grabbou)
 */

'use strict';

var Promise = require('bluebird');

module.exports = {
  installBlueprint: function(options) {
    return new Promise(function(resolve) {
      setTimeout(function() {
        resolve();
      }, 1000);
    });
  }
};