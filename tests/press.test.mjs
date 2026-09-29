import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { pressSchema } from '../src/lib/content-schema.ts';

const logo = { name: 'Publisher', image: { url: '/logo.webp' } };
test('press destinations allow external HTTP(S) links only', () => {
  for (const url of ['https://example.com/article?q=one#press', 'http://example.com/']) {
    assert.equal(pressSchema.parse({ ...logo, url }).url, url);
  }
  for (const url of [
    'javascript:alert(1)',
    'data:text/html,test',
    '//example.com',
    '/local',
    'invalid',
    '',
  ]) {
    assert.equal(pressSchema.parse({ ...logo, url }).url, null);
  }
});
test('legacy press entries without URLs still parse', () => {
  assert.equal(pressSchema.parse(logo).url, undefined);
  assert.equal(pressSchema.parse({ ...logo, url: null }).url, null);
});
test('every seeded logo has a valid destination accepted by the CMS', async () => {
  const seed = JSON.parse(await readFile(new URL('../content/seed.json', import.meta.url), 'utf8'));
  const schema = JSON.parse(
    await readFile(new URL('../cms/src/components/content/press.json', import.meta.url), 'utf8'),
  );
  const pattern = new RegExp(schema.attributes.url.regex);
  for (const entry of seed.storefront.press) {
    assert.match(entry.url, pattern);
    assert.ok(pressSchema.parse({ ...entry, image: logo.image }).url);
  }
});
