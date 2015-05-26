/*
 * @fileOverview
 * @author: Mike Grabowski (@grabbou)
 */

'use strict';

var camelCase = require('camel-case');

module.exports = {
  description: 'Generates new component',

  flags: [{
    type: Boolean,
    name: '-p, --plain-component',
    description: 'Generates pure component that does not wrap another one'
  }],

  locals: function(file, options) {
    return {
      isPlainComponent: !!options.flags.plainComponent
    };
  }
};