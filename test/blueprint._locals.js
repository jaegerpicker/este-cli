/*
 * @fileOverview
 * @author: Mike Grabowski (@grabbou)
 */

'use strict';

var Blueprint = require('../lib/models/blueprint');
var expect = require('chai').expect;
var sinon = require('sinon');

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

  var customLocals = {
    myLocal: 'a'
  };

  describe('variables', function() {

    it('should return all locals', function() {
      var locals = blueprint._locals(file, options);
      expect(locals.className).to.equal('NestedPage');
      expect(locals.camelName).to.equal('nestedPage');
      expect(locals.rootPath).to.be.defined;
      expect(locals.folderPath).to.be.defined;
    });

    it('should call locals with file and options', function() {
      blueprint.locals = sinon.spy();
      blueprint._locals(file, options);
      expect(blueprint.locals.calledWith(file, options)).to.be.true;
    });

    it('should merge locals from function', function() {
      blueprint.locals = function() {
        return customLocals;
      };
      var locals = blueprint._locals(file, options);
      expect(locals).to.have.property('myLocal');
    });

    it('should merge mapFileTokens when object', function() {
      blueprint.locals = customLocals;
      var locals = blueprint._locals(file, options);
      expect(locals).to.have.property('myLocal');
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
