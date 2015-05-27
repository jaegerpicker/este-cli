/*
 * @fileOverview
 * @author: Mike Grabowski (@grabbou)
 */

'use strict';

var Blueprint = require('../lib/models/blueprint');
var expect = require('chai').expect;

describe('Blueprint#_replaceFilePath', function() {

  var blueprint = Blueprint.load('page');
  var path =  '__root__/__server__/file.js.tpl';
  var tokens = {
    __root__: 'src/client',
    __server__: 'pages'
  };

  it('should replace all tokens', function() {
    var replacedPath = blueprint._replaceFilePath(path, tokens);
    expect(replacedPath).to.include('src/client/pages/file.js');
  });

  it('should remove template extension', function() {
    var replacedPath = blueprint._replaceFilePath(path, tokens);
    expect(replacedPath).to.not.include('.tpl');
  });

});
