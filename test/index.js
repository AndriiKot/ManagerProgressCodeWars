'use strict';

var { runFullFlowTest } = require('./runFullFlowTest.test.js');

if (require.main === module) {
  runFullFlowTest();
}

module.exports = { runFullFlowTest };
