// lib/load.js

var fs = require('fs');
var CodeWrapper = require('./load/code-wrapper');

module.exports = function load(sourcePath, variables, overrides) {
  var code = fs.readFileSync(sourcePath).toString();
  var originalWindowName = '__win' + Date.now();
  var wrapper = new CodeWrapper({
    variables: variables,
    overrides: (overrides || {}),
    window: originalWindowName
  });

  var window = {};

  (function() {
    eval(wrapper.wrap(code));
  })();

  var result = window.result;

  return result;
};
