'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { governanceSummary } = require('../src/services/directoryScore');
test('no evidence cannot produce an endorsed score', () => {
  assert.deepEqual(governanceSummary([]).supported, 0);
  assert.equal(governanceSummary([]).coveragePercent, 0);
});
test('contradictory evidence takes precedence and never earns support', () => {
  const result = governanceSummary([
    { dimension: 'sandbox', status: 'supported' },
    { dimension: 'sandbox', status: 'contradicted' },
    { dimension: 'audit', status: 'unreviewed' }
  ]);
  assert.equal(result.supported, 0);
  assert.equal(result.assessed, 1);
  assert.equal(result.dimensions.sandbox, 'contradicted');
});
test('unknown dimensions do not inflate score', () => {
  assert.equal(governanceSummary([{ dimension: 'fiction', status: 'supported' }]).coveragePercent, 0);
});
