// test/config-test.js

var expect = require('chai').expect;
var path = require('path');

describe('Config', function() {
  var configFn, config, rootPath;

  var loadConfig = function(name) {
    var rootPath = path.resolve(path.join(__dirname, 'fixtures/config'));

    return require('../lib/config')(path.join(rootPath, name));
  };

  context('#isKekstagram', function() {
    it('should recognize project by package.json/name', function() {
      config = loadConfig('kekstagram');
      expect(config.isKekstagram()).to.be.ok;
    });

    it('should not say true for project with another name', function() {
      config = loadConfig('code-and-magick');
      expect(config.isKekstagram()).to.not.be.ok;
    });
  });

  context('#isCodeAndMagick', function() {
    it('should recognize project by package.json/name', function() {
      config = loadConfig('code-and-magick');
      expect(config.isCodeAndMagick()).to.be.ok;
    });

    it('should not say true for project with another name', function() {
      config = loadConfig('keksobooking');
      expect(config.isCodeAndMagick()).to.not.be.ok;
    });
  });

  context('#isKeksobooking', function() {
    it('should recognize project by package.json/name', function() {
      config = loadConfig('keksobooking');
      expect(config.isKeksobooking()).to.be.ok;
    });

    it('should not say true for project with another name', function() {
      config = loadConfig('code-and-magick');
      expect(config.isKeksobooking()).to.not.be.ok;
    });
  });
});
