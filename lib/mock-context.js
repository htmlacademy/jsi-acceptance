// lib/mock-context.js

var expect = require('chai').expect;

var Canvas2dMethods = [
  // Rectangles methods
  'clearRect', 'fillRect', 'strokeRect',

  // Drawing text methods
  'fillText', 'strokeText', 'measureText',

  // Paths methods
  'beginPath', 'closePath', 'moveTo', 'lineTo', 'arc', 'ellipse', 'rect',

  // Drawing paths methods
  'fill', 'stroke', 'clip', 'isPointInPath', 'isPointInStroke',

  // Transform methods
  'rotate', 'scale', 'transform', 'setTransform', 'resetTransform',

  // Image methods
  'drawImage',

  // Canvas state methods
  'save', 'restore'
];

var slice = Array.prototype.slice;

var MethodCalls = function(callsArray) {
  this.callsArray = callsArray;
};

Object.assign(MethodCalls.prototype, {
  with: function() {
    var args = slice.call(arguments);

    if(args.length === 1 && typeof (args[0]) === 'function') {
      return this._withCallback(args[0]);
    }

    var compareArgs = function(args1, args2) {
      var result = true;

      if(args1.length !== args2.length) {
        return false;
      }

      args1.forEach(function(arg, i) {
        if(arg !== args2[i]) {
          result = false;
        }
      });

      return result;
    };

    return this.callsArray.filter(function(meth) {
      return compareArgs(args, meth.args);
    }).length > 0;
  },

  _withCallback: function(cb) {
    return this.callsArray.filter(function(meth) {
      return cb.apply(null, meth.args);
    }).length > 0;
  }
});

var MockContext = module.exports = function() {
  this.charWidth = 10;
  this._methodCalls = [];
};

var mp = MockContext.prototype;

mp.measureText = function(text) {
  return text.length * this.charWidth;
};

mp._saveMethodCall = function(method, args) {
  this._methodCalls.push({
    method: method,
    args: slice.call(args)
  });
};

mp.hasCalled = function(name) {
  var methCalls = this._methodCalls.filter(function(meth) {
    return meth.method === name;
  });

  if(methCalls.length === 0) {
    return null;
  } else {
    return new MethodCalls(methCalls);
  }
};

mp.hasSequence = function() {
  var args = slice.call(arguments);

  var mock = this;
  var findMethIndex = function(methName, start) {
    var index = mock._methodCalls.findIndex(function(meth) {
      return meth.method === methName;
    }, start);

    return index;
  };

  var index = findMethIndex(args.shift());

  while(index > -1 && args.length > 0) {
    index = findMethIndex(args.shift(), index);
  }

  return args.length === 0;
};

Canvas2dMethods.forEach(function(method) {
  if(!mp[method]) {
    mp[method] = function() {
      this._saveMethodCall(method, arguments);
    }
  }
});
