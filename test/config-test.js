// test/config-test.js

var expect = require('chai').expect;

describe('Config', function() {
  var config;

  beforeEach(function() {
    config = require('../lib/config');
  });

  context('#isKekstagram', function() {
    it('should recognize kekstagram path with id', function() {
      config.cwd = '/foo/bar/345345-kekstagram'
      expect(config.isKekstagram()).to.be.ok;
    });

    it('should recognize kekstagram path without id', function() {
      config.cwd = '/foo/bar/kekstagram'
      expect(config.isKekstagram()).to.be.ok;
    });

    it('should not do false positive', function() {
      config.cwd = '/foo/bar/code-and-magick';
      expect(config.isKekstagram()).to.not.be.ok;
    });
  });

  context('#isCodeAndMagick', function() {
    it('should recognize code-and-magick path with id', function() {
      config.cwd = '/foo/bar/345345-code-and-magick'
      expect(config.isCodeAndMagick()).to.be.ok;
    });

    it('should recognize code-and-magick path without id', function() {
      config.cwd = '/foo/bar/code-and-magick'
      expect(config.isCodeAndMagick()).to.be.ok;
    });

    it('should recognize code-and-magick even without dashes', function() {
      config.cwd = '/foo/bar/codeandmagick'
      expect(config.isCodeAndMagick()).to.be.ok;
    });

    it('should not do false positive', function() {
      config.cwd = '/foo/bar/kekstagram';
      expect(config.isCodeAndMagick()).to.not.be.ok;
    });
  });
});
