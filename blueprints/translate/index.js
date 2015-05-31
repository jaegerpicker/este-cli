/*
 * @fileOverview
 * @author: Mike Grabowski (@grabbou)
 */

'use strict';

var recast = require('recast');
var b = recast.types.builders;

module.exports = {

  skipExistingFiles: true,

  description: 'Generates new translation',

  afterInstall: function(options) {
    var messagesFile = path.join(options.rootFolder, 'messages.js');
    var data = recast.parse(fs.readFileSync(messagesFile).toString());

    return new Promise.fromNode(function(callback) {
      var modifiedElement = recast.print(data).code;
      fs.writeFile(statePath, modifiedElement, callback);
    });
  }

};