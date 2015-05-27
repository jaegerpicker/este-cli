/*
 * @fileOverview
 * @author: Mike Grabowski (@grabbou)
 */

'use strict';

var Promise = require('bluebird');
var Task = require('../models/task');

module.exports = Task.extend({

  _run: function runTask(passedOptions, passedFlags) {

    var deferred = passedFlags.add ? this._enableSemicolons() : this._disableSemicolons();

    return Promise.resolve(deferred);

  },

  /**
   * Enables semicolons in project by adding them to all required parts
   * @method enableSemicolons
   * @private
   */
  _enableSemicolons: function() {
    console.log('Enable');
  },

  /**
   * Disables semicolons by removing them from the places where JS compiler
   * can figure it out
   * @method disableSemicolons
   * @private
   */
  _disableSemicolons: function() {
    console.log('Disable');
  }

});