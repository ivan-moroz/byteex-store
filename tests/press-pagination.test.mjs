import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pressPageSize } from '../src/lib/press-pagination.ts';

test('only whole logos fit, including gaps and exact boundaries', () => {
  assert.equal(pressPageSize(320, 115, 25, 9), 2);
  assert.equal(pressPageSize(395, 115, 25, 9), 3);
  assert.equal(pressPageSize(394.9, 115, 25, 9), 2);
  assert.equal(pressPageSize(114, 115, 25, 9), 0);
});
test('capacity adapts between mobile, tablet, desktop and empty galleries', () => {
  assert.equal(pressPageSize(388, 115, 25, 4), 2);
  assert.equal(pressPageSize(704, 126.72, 45, 4), 4);
  assert.equal(pressPageSize(1280, 230.4, 45, 9), 4);
  assert.equal(pressPageSize(1280, 230.4, 45, 0), 0);
  assert.equal(pressPageSize(0, 115, 25, 4), 0);
});
