const { test } = require('node:test');
const assert = require('node:assert/strict');
const stage = process.argv[2] || 'fixed';
if (!['buggy', 'attempt', 'fixed'].includes(stage)) {
  throw new Error('Use: node test.cjs buggy|attempt|fixed');
}
const take = require(`./${stage}.cjs`);
const items = ['oak', 'ash', 'elm', 'beech'];

test('omitted limit uses the default of three', () => {
  assert.deepEqual(take(items), ['oak', 'ash', 'elm']);
});
test('null limit uses the default of three', () => {
  assert.deepEqual(take(items, null), ['oak', 'ash', 'elm']);
});
test('zero requests no items', () => {
  assert.deepEqual(take(items, 0), []);
});
test('positive limit returns that many items', () => {
  assert.deepEqual(take(items, 2), ['oak', 'ash']);
});
test('large limit and empty input are safe', () => {
  assert.deepEqual(take(items, 20), items);
  assert.deepEqual(take([], 2), []);
});
test('input remains unchanged and the result is a new array', () => {
  const input = Object.freeze(['oak', 'ash', 'elm', 'beech']);
  assert.deepEqual(take(input, 2), ['oak', 'ash']);
  assert.deepEqual(input, items);
  assert.notEqual(take(input, 20), input);
});
