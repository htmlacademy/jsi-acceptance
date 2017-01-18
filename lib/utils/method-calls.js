// lib/utils/method-calls.js

var slice = Array.prototype.slice;

/**
 * Container for method calls
 */

var MethodCalls = module.exports = function(callsArray) {
  this.callsArray = callsArray;
};

var mp = MethodCalls.prototype;

/**
 * Проверяет, что метод был вызван с указанными параметрами
 *
 * @example
 *
 * methodCalls.with(1, 2, 3) // => возвращает true, если метод вызывался с параметрами 1, 2, 3
 */
mp.with = function() {
  var args = slice.call(arguments);
  var cb = args[0];

  if (args.length === 1 && typeof(cb) === 'function') {
    return this._withCallback(cb);
  }

  var compareArgs = function(args1, args2) {
    var result = true;

    if (args1.length !== args2.length) {
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
};

mp._withCallback = function(cb) {
  return this.callsArray.filter(function(meth) {
    return cb.apply(null, meth.args);
  }).length > 0;
};


