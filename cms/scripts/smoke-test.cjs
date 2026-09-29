// Run from cms/ with Strapi and Next.js running. Only a temporary test product is changed.
const { createStrapi } = require('@strapi/strapi');
const fs = require('node:fs/promises');
const path = require('node:path');
const assert = require('node:assert/strict');
async function main() {
  process.env.SEED_DEMO = 'false';
  const env = await fs.readFile(path.resolve('../.env.local'), 'utf8');
  const token = env.match(/^STRAPI_API_TOKEN=(.+)$/m)?.[1].trim();
  assert.ok(token, 'Configure the frontend API token first.');
  const api = 'http://127.0.0.1:1337/api/products';
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
  assert.equal((await fetch(api)).status, 403, 'Anonymous reads must be disabled');
  assert.equal(
    (await fetch(api, { method: 'POST', headers, body: JSON.stringify({ data: {} }) })).status,
    403,
    'Frontend token must not allow writes',
  );
  const app = createStrapi({ appDir: process.cwd(), distDir: path.resolve('dist') });
  let documentId;
  try {
    await app.load();
    const products = app.documents('api::product.product');
    const source = await products.findFirst({
      status: 'published',
      populate: ['heroImages', 'gallery'],
    });
    assert.ok(source, 'Seed at least one product first');
    const slug = `integration-check-${Date.now()}`;
    const product = await products.create({
      status: 'published',
      data: {
        title: 'Temporary integration check',
        slug,
        category: source.category,
        description: source.description,
        heroHeading: 'Integration check initial heading',
        heroImages: source.heroImages.map(({ id }) => id),
        gallery: source.gallery.map(({ id }) => id),
        galleryCaption: source.galleryCaption,
        sortOrder: 9999,
      },
    });
    documentId = product.documentId;
    const url = `http://127.0.0.1:3000/products/${slug}`;
    const initial = await fetch(url);
    assert.equal(initial.status, 200);
    assert.match(await initial.text(), /Integration check initial heading/);
    await products.update({
      documentId,
      status: 'published',
      data: { heroHeading: 'Integration check updated heading' },
    });
    assert.match(await (await fetch(url)).text(), /Integration check updated heading/);
    console.log('PASS: API permissions, published product rendering, and CMS update propagation.');
  } finally {
    if (documentId) {
      await app.documents('api::product.product').delete({ documentId });
      console.log('Temporary test product removed. Existing products were not changed.');
    }
    await app.destroy();
  }
}
main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
