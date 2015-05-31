/*
 * @fileOverview
 * @author: Mike Grabowski (@grabbou)
 */

'use strict';

var File = require('../../lib/models/file');
var camelCase = require('camel-case');
var path = require('path');
var Promise = require('bluebird');
var fs = require('fs');

module.exports = {

  skipExistingFiles: true,

  description: 'Generates new translation',

  afterInstall: function(options) {
    var messagesFile = path.join(options.rootFolder, 'messages.js');
    var file = File.load(messagesFile);

    var messageProperty = camelCase(options.blueprintName);

    var messages = file.getObjectExpression();

    if (!messages.hasProperty(messageProperty)) {
      messages.addProperty(messageProperty);
    }

    return new Promise.fromNode(function(callback) {
      fs.writeFile(messagesFile, file.print(), callback);
    });
  }

};