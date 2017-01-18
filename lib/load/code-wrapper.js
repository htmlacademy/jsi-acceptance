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
  this.overrides = this.opts.overrides;
};

var saveWindow = function(name) {
  name || (name = '__originalWindow');
  return `var ${name} = window;\n`;
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
        `var ${variables.join(', ')};\n`
      );
    }
  },

  afterword: function() {
    var windowName = this.opts.window;
    var variables = this.variables;
    var overrides = this.overrides;

    var result = '';

    if (overrides && Object.keys(overrides).length > 0) {
      result = result.concat(
        Object.keys(overrides).map(function(key) {
          return '\n' + key + ' = ' + JSON.stringify(overrides[key]) + ';';
        }).join('')
      );
    }

    if (variables && variables.length) {
      result = result.concat(
        saveToWindow(windowName) +
        '{\n' +
        variables.map(function(varName) {
          return `  ${varName}: window.${varName} || ${varName}`;
        }).join(',\n') +
        '};\n'
      );
    }

    return result;
  }
});
