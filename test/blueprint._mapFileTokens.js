/*
 * @fileOverview
 * @author: Mike Grabowski (@grabbou)
 */

'use strict';

var Blueprint = require('../lib/models/blueprint');
var expect = require('chai').expect;
var sinon = require('sinon');

describe('Blueprint#_mapFileTokens', function() {

  var blueprint = Blueprint.load('page');
  var fileTokens = {
    customToken: 'abcd',
    __root__: 'newRoot'
  };
  var options = {
    __root__: 'originalRoot'
  };

  it('should return built-in tokens', function() {
    var tokens = blueprint._mapFileTokens(options);
    expect(tokens).to.have.property('__root__');
  });

  it('should call mapFileTokens with options when function', function() {
    blueprint.mapFileTokens = sinon.spy();
    blueprint._mapFileTokens(options);
    expect(blueprint.mapFileTokens.calledWith(options)).to.be.true;
  });

  it('should merge mapFileTokens from function', function() {
    blueprint.mapFileTokens = function() {
      return fileTokens;
    };
    var tokens = blueprint._mapFileTokens(options);
    expect(tokens).to.have.property('customToken');
  });

  it('should merge mapFileTokens when object', function() {
    blueprint.mapFileTokens = fileTokens;
    var tokens = blueprint._mapFileTokens(options);
    expect(tokens).to.have.property('customToken');
  });

  it('should override built-ins', function() {
    blueprint.mapFileTokens = fileTokens;
    var tokens = blueprint._mapFileTokens(options);
    expect(tokens.__root__).to.equals(fileTokens.__root__);
  });

});
