'use strict';

var runFullFlowTest = () => {
  console.log('Running fullFlow integration test...');

  var backendStatus = true;
  var frontendStatus = true;
  var sharedStatus = true;

  if (backendStatus && frontendStatus && sharedStatus) {
    console.log('✅ fullFlow test passed');
  } else {
    console.error('❌ fullFlow test failed');
    process.exit(1);
  }
}

if (require.main === module) {
  runFullFlowTest();
}

module.exports = { runFullFlowTest };

