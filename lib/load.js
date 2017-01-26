// lib/load.js

var fs = require('fs');
var jsdom = require('jsdom').jsdom;
var CodeWrapper = require('./load/code-wrapper');

var _evalScript = function (code, variables, overrides) {
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

exports.load = function load(sourcePath, variables, overrides) {
  var code = fs.readFileSync(sourcePath).toString();

  return _evalScript(code, variables, overrides);
};

exports.loadFromHtml = function loadFromHtml(htmlPath, variables, overrides) {
  var htmlCode = fs.readFileSync(htmlPath).toString();
  var doc = jsdom(htmlCode);

  var scripts = doc.querySelectorAll('body > script');
  var lastScriptWithoutSource = null;

  for(var i = scripts.length - 1; i >= 0; i -= 1) {
    var script = scripts[i];

    if (!script.src) {
      lastScriptWithoutSource = script;
      break;
    }
  }

  return _evalScript(
    lastScriptWithoutSource.textContent || '',
    variables,
    overrides
  );
};
