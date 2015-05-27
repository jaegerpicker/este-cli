/*
 * @fileOverview
 * @author: Mike Grabowski (@grabbou)
 */

'use strict';

var Blueprint = require('../../../lib/models/blueprint');
var expect = require('chai').expect;
var sinon = require('sinon');
var Promise = require('bluebird');

describe('Page#afterInstall', function() {

  var blueprint = Blueprint.load('page');
  var options = {
    blueprintName: 'todos',
    rootFolder: 'src/client'
  };

  it('afterInstall should return promise', function() {
    expect(blueprint.afterInstall(options)).to.be.instanceOf(Promise);
  });

});
