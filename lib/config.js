// lib/config.js

var path = require('path');

var KEKSTAGRAM = 'kekstagram';
var CODE_AND_MAGICK = 'code-and-magick';
var KEKSOBOOKING = 'keksobooking';

module.exports = function(cwd) {
  if (!cwd) {
    cwd = process.cwd();
  }

  return {
    _loadConfig: function() {
      if (!this.config) {
        var packageJson = path.join(cwd, 'package.json');
        this.config = require(packageJson);
      }

      return this.config;
    },

    _hasOriginWith: function(fragment) {
      var config = this._loadConfig();

      return config.repository.url.indexOf(fragment) > -1;
    },

    _hasNameWith: function(fragment) {
      var config = this._loadConfig();

      return config.name.indexOf(fragment) > -1;
    },

    /**
     * Определяем, принадлежит ли текущий каталог
     *   проекту «Кекстаграм»
     */
    isKekstagram: function() {
      return this._hasOriginWith(KEKSTAGRAM);
    },

    /**
     * Определяем, принадлежит ли текущий каталог
     *   проекту «Код и магия»
     */
    isCodeAndMagick: function() {
      return this._hasOriginWith(CODE_AND_MAGICK);
    },

    /**
     * Определяем, принадлежит ли текущий каталог
     *   проекту «Кексобукинг»
     */
    isKeksobooking: function() {
      return this._hasOriginWith(KEKSOBOOKING);
    }
  };
};
