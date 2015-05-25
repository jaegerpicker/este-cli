/*
 * @fileOverview
 * @author: Mike Grabowski (@grabbou)
 */

'use strict';

function Task() {}

module.exports = Task;

Task.prototype.run = function() {
  throw new Error('Task needs to have run() defined.');
};