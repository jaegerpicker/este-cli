/*
 * @fileOverview
 * @author: Mike Grabowski (@grabbou)
 */

'use strict';

var Blueprint = require('../../../lib/models/blueprint');
var expect = require('chai').expect;
var sinon = require('sinon');

describe('Page#afterInstall', function() {

  var blueprint = Blueprint.load('page');
  var options = {
    blueprintName: 'todos'
  };

  it('should call route generator', function() {
    var spy = sinon.spy(blueprint, 'afterInstall');
    blueprint.install(options);
    expect(spy.calledWith(options));
  });

});
