import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
const content = JSON.parse(
  await readFile(new URL('../content/seed.json', import.meta.url), 'utf8'),
);
test('seed product slugs are unique and routes have required images', async () => {
  const slugs = content.products.map((p) => p.slug);
  assert.equal(new Set(slugs).size, slugs.length);
  for (const product of content.products) {
    assert.match(product.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.ok(product.heroImages.length >= 3);
    assert.ok(product.gallery.length > 0);
  }
});
test('every seeded media asset exists and has alternative text', async () => {
  async function check(value) {
    if (Array.isArray(value)) {
      await Promise.all(value.map(check));
      return;
    }
    if (value && typeof value === 'object') {
      if (value.asset) {
        assert.ok(value.alternativeText);
        await access(new URL(`../public/figma/${value.asset}`, import.meta.url));
      } else await Promise.all(Object.values(value).map(check));
    }
  }
  await check(content);
});
test('CMS schemas expose every seeded editor field', async () => {
  for (const name of ['product', 'storefront']) {
    const schema = JSON.parse(
      await readFile(
        new URL(`../cms/src/api/${name}/content-types/${name}/schema.json`, import.meta.url),
        'utf8',
      ),
    );
    const entries = name === 'product' ? content.products : [content.storefront];
    for (const item of entries)
      for (const field of Object.keys(item))
        assert.ok(field in schema.attributes, `${name}.${field} must be editable in Strapi`);
  }
});
