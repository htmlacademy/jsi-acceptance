// lib/load.js

var fs = require('fs');

module.exports = function load(sourcePath) {
  var code = fs.readFileSync(sourcePath).toString();
  var window = { eval: function() {}, document: null };

  var oldKeys = Object.keys(this);
  var oldWindow = global.window;
  var oldWindowKeys = Object.keys(window);

  global.window = window;

  eval.call(null, code);

  var result = {};

  var newKeys = Object.keys(this);
  var newWindowKeys = Object.keys(window);

  newKeys.forEach(function(key) {
    if(oldKeys.indexOf(key) === -1) {
      result[key] = this[key];
      delete this[key];
    }
  }, this);

  newWindowKeys.forEach(function(key) {
    if(oldWindowKeys.indexOf(key) === -1) {
      result[key] = window[key];
      delete window[key];
    }
  });

  global.window = oldWindow;

  delete result.window;

  return result;
};
