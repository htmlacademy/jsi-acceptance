// lib/load/code-wrapper.js

// Synopsis
//    var code = '.....'; // some loaded code
//    var wrapper = new CodeWrapper(['getMessage']);
//    var window = {};
//
//    eval(wrapper.wrap(code));
//
//    var getMessage = window.result.getMessage;

var CodeWrapper = module.exports = function(opts) {
  this.opts = opts || {};
  this.variables = this.opts.variables;
};

var saveWindow = function(name) {
  name || (name = '__originalWindow');
  return `var ${name} = window;`;
};

var saveToWindow = function(name) {
  name || (name = '__originalWindow');
  return `${name}.result = `;
};

Object.assign(CodeWrapper.prototype, {
  wrap: function(code) {
    return `${this.preamble()}${code}${this.afterword()}`;
  },

  preamble: function() {
    var windowName = this.opts.window;
    var variables = this.variables;

    if(!variables || !variables.length) {
      return '';
    } else {
      return (
        saveWindow(windowName) +
        'var ' + variables.join(', ') + ';'
      );
    }
  },

  afterword: function() {
    var windowName = this.opts.window;
    var variables = this.variables;

    if(!variables || !variables.length) {
      return '';
    } else {
      return (
        saveToWindow(windowName) +
        '{' +
        variables.map(function(varName) {
          return `${varName}: window.${varName} || ${varName}`;
        }).join(', ') +
        '}'
      );
    }
  }
});
