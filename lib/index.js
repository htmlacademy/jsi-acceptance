// lib/index.js

module.exports = {
  config: require('./config'),
  load: require('./load').load,
  loadFromHtml: require('./load').loadFromHtml,
  MockContext: require('./mock-context'),
  CodeWrapper: require('./load/code-wrapper')
};
