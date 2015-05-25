/*
 * @fileOverview
 * @author: Mike Grabowski (@grabbou)
 */

'use strict';

var CoreObject = require('core-object');

module.exports = Task;

function Task() {
  CoreObject.apply(this, arguments);
}

Task.__proto__ = CoreObject;
Task.prototype.constructor = Task;

Task.prototype.run = function() {
  throw new Error('Task needs to have run() defined.');
};