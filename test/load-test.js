// test/load-test.js

var path = require('path');
var expect = require('chai').expect;
var load = require('../lib/load');

var loadFixture = function(name) {
  return load(
    path.resolve(
      path.join(__dirname, 'fixtures/load', name + '.js')
    ),
    ['hello']
  );
};

describe('load module', function() {
  it('should load function from var-file', function() {
    var obj = loadFixture('hello-var');
    expect(obj.hello).to.be.a('function');
  });

  it('should load function from window-file', function() {
    var obj = loadFixture('hello-window');
    expect(obj.hello).to.be.a('function');
  });

  it('should load function from function-file', function() {
    var obj = loadFixture('hello-function');
    expect(obj.hello).to.be.a('function');
  });
});
