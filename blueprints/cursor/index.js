/*
 * @fileOverview
 * @author: Mike Grabowski (@grabbou)
 */

'use strict';

var recast = require('recast');
var builders = recast.types.builders;
var Promise = require('bluebird');
var path = require('path');
var fs = require('fs');

module.exports = {
  installBlueprint: function(options) {
    var statePath = path.join(options.serverFolder, 'initialstate.js');
    var data = recast.parse(fs.readFileSync(statePath).toString());
    var exportNode = null;
    recast.visit(data.program.body, {
      visitExportDeclaration: function(data) {
        exportNode = data;
        return false;
      }
    });
    if (exportNode) {
      var node = builders.property(
        'init',
        builders.identifier(options.blueprintName),
        builders.objectExpression([])
      );
      exportNode.value.declaration.properties.push(node);
      var modifiedElement = recast.print(data).code;
      fs.writeFileSync(statePath, modifiedElement);
    }
    return new Promise(function(resolve) {
      setTimeout(function() {
        resolve();
      }, 1000);
    });

  }
};