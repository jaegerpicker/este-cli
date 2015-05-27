/*
 * @fileOverview
 * @author: Mike Grabowski (@grabbou)
 */

'use strict';

var Blueprint = require('../lib/models/blueprint');
var expect = require('chai').expect;
var Promise = require('bluebird');

describe('Blueprint#installBlueprint', function() {

  var blueprint = Blueprint.load('page');

  var options = {
    __root__: 'originalRoot'
  };

  it('should return promise', function() {
    expect(blueprint.installBlueprint(options)).to.be.instanceOf(Promise);
  });

});
