/*
 * @fileOverview
 * @author: Mike Grabowski (@grabbou)
 */

'use strict';

var Blueprint = require('../lib/models/blueprint');
var expect = require('chai').expect;
var sinon = require('sinon');

describe('Blueprint#install', function() {

  var blueprint = Blueprint.load('page');
  var stub = sinon.stub(blueprint, '_process');
  var options = {
    option1: 'option1'
  };

  it('should call _process', function() {
    blueprint.install();
    expect(stub.called).to.be.true;
  });

  it('should pass options to _process', function() {
    blueprint.install(options);
    expect(stub.calledWith(options)).to.be.true;
  });

});
