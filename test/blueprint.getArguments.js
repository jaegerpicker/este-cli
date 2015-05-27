/*
 * @fileOverview
 * @author: Mike Grabowski (@grabbou)
 */

'use strict';

var Blueprint = require('../lib/models/blueprint');
var expect = require('chai').expect;

describe('Blueprint#getArguments', function() {

  var blueprint = Blueprint.load('page');
  var args = [{
    arg: 'arg1'
  }];

  it('should return name argument by default', function() {
    var blueprintArgs = blueprint.getArguments();
    expect(blueprintArgs).to.be.instanceOf(Array);
    expect(blueprintArgs.length).to.equals(1);
    expect(blueprintArgs[0]).to.have.property('name');
    expect(blueprintArgs[0]).to.have.property('property');
    expect(blueprintArgs[0]).to.have.property('required');
  });

  it('should return custom arguments', function() {
    blueprint.args = args;
    var blueprintFlags = blueprint.getArguments();
    expect(blueprintFlags.length).to.equals(2);
    expect(blueprintFlags[1]).to.have.property('arg');
  });

});
