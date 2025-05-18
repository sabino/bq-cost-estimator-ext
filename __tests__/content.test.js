const test = require('node:test');
const assert = require('node:assert/strict');
global.browser = { storage: { sync: { get: () => {} } } };
global.chrome = global.browser; // mock chrome for content.js
global.window = {};
const { parseNumberLocaleAware, computeCostUSD, generateCostDisplay } = require('../content.js');

test('parseNumberLocaleAware parses dot', () => {
  assert.equal(parseNumberLocaleAware('3.14'), 3.14);
});

test('parseNumberLocaleAware parses comma', () => {
  assert.equal(parseNumberLocaleAware('3,14'), 3.14);
});

test('parseNumberLocaleAware handles thousands', () => {
  assert.equal(parseNumberLocaleAware('1.234,56'), 1234.56);
});

test('computeCostUSD conversions', () => {
  assert.ok(Math.abs(computeCostUSD(1, 'GB') - 0.00625) < 1e-6);
  assert.ok(Math.abs(computeCostUSD(1, 'TB') - 6.25) < 1e-6);
});

test('generateCostDisplay works', () => {
  const prefs = { showUSD: true, customCurrencyEnabled: true, customCurrencySymbol: 'R$', customCurrencyRate: 5 };
  assert.equal(generateCostDisplay(2, prefs), '$2.00 / R$ 10.00');
  const prefs2 = { showUSD: true, customCurrencyEnabled: false };
  assert.equal(generateCostDisplay(1, prefs2), '$1.00');
});
