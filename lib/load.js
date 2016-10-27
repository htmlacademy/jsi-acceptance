// lib/load.js

var fs = require('fs');

var keepSnapshot = function(obj) {
  obj || (obj = global);
  return Object.assign({}, obj);
};

var restoreSnapshot = function(snapshot, obj) {
  obj || (obj = global);

  Object.keys(obj).forEach(function(key) {
    if(!snapshot.hasOwnProperty(key)) {
      delete obj[key];
    } else {
      global[key] = snapshot[key];
    }
  });
};

var diffSnapshot = function(snapshot, obj) {
  obj || (obj = global);

  return Object.keys(obj).filter(function(key) {
    return !snapshot.hasOwnProperty(key);
  }).reduce(function(hash, key) {
    hash[key] = obj[key];
    return hash;
  }, {});
};

module.exports = function load(sourcePath) {
  var code = fs.readFileSync(sourcePath).toString();

  // Save global snapshot
  var globalSnapshot = keepSnapshot();

  // Create window object to substitute real window
  var window = { eval: function() {}, document: null };
  var windowSnapshot = keepSnapshot(window);

  // And put it into global scope
  global.window = window;

  // Call eval in global scope
  eval.call(null, code);

  // Fetch changes from
  //
  var result = Object.assign(
    {},
    diffSnapshot(globalSnapshot),          // .. global scope
    diffSnapshot(windowSnapshot, window)   // .. and window scope
  );

  // Remove window from result
  delete result.window;

  // Restore global context
  restoreSnapshot(globalSnapshot);

  // Return fetched variables
  return result;
};
