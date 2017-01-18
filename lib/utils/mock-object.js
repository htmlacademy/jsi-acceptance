// lib/utils/mock-object.js

var MethodCalls = require('./method-calls');

var slice = Array.prototype.slice;

var hasCalled = function(name) {
  var methCalls = this._methodCalls.filter(function(meth) {
    return meth.method === name;
  });

  if(methCalls.length === 0) {
    return null;
  } else {
    return new MethodCalls(methCalls);
  }
};

var hasSequence = function() {
  var args = slice.call(arguments);

  var mock = this;
  var findMethIndex = function(methName, start) {
    if(!start) {
      start = 0;
    }

    var index = mock._methodCalls.slice(start).findIndex(function(meth) {
      return meth.method === methName;
    });

    if(index > -1) {
      return start + index;
    } else {
      return -1;
    }
  };

  var index = findMethIndex(args.shift());

  while(index > -1 && args.length > 0) {
    index = findMethIndex(args.shift(), index + 1);
  }

  return args.length === 0 && index > -1;
};

var addMockDataAndMethods = function(obj) {
  obj._methodCalls = [];

  obj._saveMethodCall = function(method, args) {
    this._methodCalls.push({
      method: method,
      args: slice.call(args)
    });
  };

  obj.hasCalled = hasCalled;
  obj.hasSequence = hasSequence;
};

var buildStubs = function(obj, methods) {
  if (Array.isArray(methods)) {
    var _saveThisMethodCall = obj._saveMethodCall.bind(obj);

    methods.forEach(function(method) {
      this[method] = function() {
        _saveThisMethodCall(method, slice.call(arguments));
      }
    }, obj);
  }
};

var wrapMocks = function(obj, mocks) {
  var _saveThisMethodCall = obj._saveMethodCall.bind(obj);

  if (mocks) {
    Object.keys(mocks).forEach(function(method) {
      this[method] = function() {
        _saveThisMethodCall(method, arguments);
        mocks[method].apply(this, slice.call(arguments));
      };
    }, obj)
  }
};


module.exports = function mockObject(obj, opts) {
  if (!opts) {
    opts = {};
  }

  addMockDataAndMethods(obj);
  buildStubs(obj, opts.stubs);
  wrapMocks(obj, opts.mocks);
};
