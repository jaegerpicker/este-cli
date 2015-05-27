/*
 * @fileOverview
 * @author: Mike Grabowski (@grabbou)
 */

'use strict';

var Blueprint = require('../lib/models/blueprint');
var Promise = require('bluebird');
var expect = require('chai').expect;
var sinon = require('sinon');

describe('Blueprint#_process', function() {

    var blueprint = Blueprint.load('page');
    var options = {};

    var noop = function() {};

    it('should return a promise', function() {
      expect(blueprint._process(options, noop, noop, noop)).to.be.instanceOf(Promise);
    });

    it('should invoke before and after install hooks', function(done) {
      var hook = sinon.spy();
      var promise = blueprint._process(options, hook, hook, hook);
      promise.finally(function() {
        expect(hook.callCount).to.equal(3);
        done();
      });
    });

    it('should bind functions to blueprint context', function(done) {
      var hook = sinon.spy();
      var promise = blueprint._process(options, hook, hook, hook);
      promise.finally(function() {
        expect(hook.calledOn(blueprint)).to.be.true;
        done();
      });
    });

    it('should not run install if before hook fails', function(done) {
      var hook = sinon.spy();
      var failingBeforeHook = function() {
        throw new Error('Error');
      };
      var promise = blueprint._process(options, failingBeforeHook, hook, hook);
      promise
        .finally(function() {
          expect(hook.callCount).to.equal(0);
          done();
        })
        .catch(noop);
    });

});