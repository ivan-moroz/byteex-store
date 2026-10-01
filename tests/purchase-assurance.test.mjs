import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { storefrontSchema } from '../src/lib/content-schema.ts';

test('native assurance component IDs do not alter the frontend content contract', async () => {
  const seed = JSON.parse(await readFile(new URL('../content/seed.json', import.meta.url), 'utf8'));
  const value = seed.storefront.purchaseAssurance;
  const response = {
    ...value,
    id: 42,
    benefits: value.benefits.map((item, id) => ({ id, ...item })),
    paymentMethods: value.paymentMethods.map((item, id) => ({ id, ...item })),
  };
  assert.deepEqual(storefrontSchema.shape.purchaseAssurance.parse(response), value);
  assert.equal(storefrontSchema.shape.purchaseAssurance.parse(null), null);
});

test('assurance uses native fields and keeps migration state private and hidden', async () => {
  const read = async (file) => JSON.parse(await readFile(new URL(file, import.meta.url), 'utf8'));
  const storefront = await read('../cms/src/api/storefront/content-types/storefront/schema.json');
  assert.equal(storefront.attributes.purchaseAssurance.component, 'content.purchase-assurance');
  const { attributes } = await read('../cms/src/components/content/purchase-assurance.json');
  assert.equal(attributes.shippingNotice.type, 'string');
  for (const field of ['benefits', 'paymentMethods']) {
    assert.equal(attributes[field].type, 'component');
    assert.equal(attributes[field].repeatable, true);
  }
  for (const field of ['purchaseAssuranceLegacy', 'purchaseAssuranceMigrated']) {
    assert.equal(storefront.attributes[field].private, true);
    assert.equal(storefront.attributes[field].visible, false);
    assert.equal(storefront.attributes[field].pluginOptions['content-manager'].visible, false);
  }
  assert.equal(storefront.attributes.purchaseAssuranceLegacy.columnName, 'purchase_assurance');
});
