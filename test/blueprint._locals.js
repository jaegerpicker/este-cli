/*
 * @fileOverview
 * @author: Mike Grabowski (@grabbou)
 */

'use strict';

var Blueprint = require('../lib/models/blueprint');
var expect = require('chai').expect;
var sinon = require('sinon');

process.chdir(__dirname);

describe('Blueprint#_locals', function() {

  var blueprint = Blueprint.load('page');

  // Fake file
  var file = {
    path: '/Users/grabbou/Repositories/este-cli/blueprints/page/files/src/client/pages/d.react.js',
    base: '/Users/grabbou/Repositories/este-cli/blueprints/page/files/'
  };

  var options = {
    rootFolder: 'src/client',
    blueprintName: 'nested/page'
  };

  describe('variables', function() {

    it('should return all locals', function() {
      var locals = blueprint._locals(file, options);
      expect(locals.className).to.equal('NestedPage');
      expect(locals.camelName).to.equal('nestedPage');
    });

  });

  describe('root level', function() {

    it('should have root & folder paths calculated properly', function() {
      var locals = blueprint._locals(file, options);
      expect(locals.rootPath).to.equal('..');
      expect(locals.folderPath).to.equal('.');
    });

  });

  describe('nested level', function() {

    // Fake file
    var fileNested = {
      path: '/Users/grabbou/Repositories/este-cli/blueprints/page/files/src/client/pages/d/d.react.js',
      base: '/Users/grabbou/Repositories/este-cli/blueprints/page/files/'
    };

    it('should have root & folder paths calculated properly', function() {
      var locals = blueprint._locals(fileNested, options);
      expect(locals.rootPath).to.equal('../..');
      expect(locals.folderPath).to.equal('..');
    });

  });


});
