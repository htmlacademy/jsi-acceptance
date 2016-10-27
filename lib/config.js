// lib/config.js

var path = require('path');

module.exports = {
  cwd: path.resolve('.'),

  isKekstagram: function() {
    return this.cwd.indexOf('keksta') > -1;
  },

  isCodeAndMagick: function() {
    return this.cwd.indexOf('code') > -1;
  }
};
