// lib/index.js

module.exports = {
  config: require('./config'),
  load: require('./load'),
  MockContext: require('./mock-context'),
  CodeWrapper: require('./load/code-wrapper')
};
