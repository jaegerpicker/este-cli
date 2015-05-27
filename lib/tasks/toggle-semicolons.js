/*
 * @fileOverview
 * @author: Mike Grabowski (@grabbou)
 */

'use strict';

var Task = require('../models/task');

module.exports = Task.extend({

  run: function runTask(passedOptions, passedFlags) {

   if (passedFlags.add) {
     this._enableSemicolons();
   } else {
     this._disableSemicolons();
   }

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