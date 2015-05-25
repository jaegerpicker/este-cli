/*
 * @fileOverview
 * @author: Mike Grabowski (@grabbou)
 */

'use strict';

var recast = require('recast');
var b = recast.types.builders;
var path = require('path');
var fs = require('fs');
var _ = require('lodash');

var getAction = require('./helpers/get-action');
var getNode = require('./helpers/action-node');

module.exports = {
  skipExistingFiles: true,
  description: 'Generates new action',
  afterInstall: function(options) {
    var actionPath = path.join(options.rootFolder, options.blueprintName, 'actions.js');
    var data = recast.parse(fs.readFileSync(actionPath).toString());
    var setToString = getAction(data);

    if (!setToString) {
      return Promise.reject('Couldn\'t find `setToString` method. Make sure it exists');
    }

    var node = getNode({
      name: options.blueprintName
    });

    setToString.insertBefore(node);

    var actionProperty = b.property(
      'init',
      b.identifier(options.blueprintName),
      b.identifier(options.blueprintName)
    );

    actionProperty.shorthand = true;

    setToString.value.expression.arguments[1].properties.push(actionProperty);

    console.log(recast.print(setToString).code);

  }
};