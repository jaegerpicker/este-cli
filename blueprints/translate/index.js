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

  args: [{
    type: String,
    name: 'translations',
    property: 'blueprintTranslations'
  }],

  description: 'Generates new translation',

  afterInstall: function(options) {
    var messagesFile = path.join(options.rootFolder, 'messages.js');
    var file = File.load(messagesFile);

    var messageProperty = camelCase(options.blueprintName);

    var messages = file.getObjectExpression();

    var translateProperty = messages.getProperty(messageProperty);

    if (!translateProperty) {
      translateProperty = messages.addProperty(messageProperty);
    }

    // Parse optional translation keys
    if (options.blueprintTranslations) {
      var translations = options.blueprintTranslations.split(',');
      var innerMessages = file.getObjectExpression(translateProperty);

      if (!innerMessages) {
        return Promise.reject(messageProperty + ' is a string, cannot add nested translations');
      }

      translations.forEach(function(trans) {
        if (!innerMessages.hasProperty(trans)) {
          innerMessages.addProperty(trans, false, trans);
        }
      });
    }

    return new Promise.fromNode(function(callback) {
      fs.writeFile(messagesFile, file.print(), callback);
    });
  }

};