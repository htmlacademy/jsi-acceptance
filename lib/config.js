// lib/config.js

var path = require('path');

module.exports = {
  cwd: path.resolve('.'),

  /**
   * Определяем, принадлежит ли текущий каталог
   *   проекту «Кекстаграм»
   */
  isKekstagram: function() {
    return this.cwd.indexOf('keksta') > -1;
  },

  /**
   * Определяем, принадлежит ли текущий каталог
   *   проекту «Код и магия»
   */
  isCodeAndMagick: function() {
    return this.cwd.indexOf('code') > -1;
  }
};
