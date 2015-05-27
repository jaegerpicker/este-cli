/*
 * @fileOverview
 * @author: Mike Grabowski (@grabbou)
 */

'use strict';

var Blueprint = require('../lib/models/blueprint');
var expect = require('chai').expect;

describe('Blueprint#getFlags', function() {

  var blueprint = Blueprint.load('page');
  var flags = [{
    flag1: 'flag1'
  }];

  it('should return no flags by default', function() {
    var blueprintFlags = blueprint.getFlags();
    expect(blueprintFlags).to.be.instanceOf(Array);
    expect(blueprintFlags.length).to.equals(0);
  });

  it('should return custom flags', function() {
    blueprint.flags = flags;
    var blueprintFlags = blueprint.getFlags();
    expect(blueprintFlags.length).to.equals(1);
    expect(blueprintFlags[0]).to.have.property('flag1');
  });

});
