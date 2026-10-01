// Run from cms/ after building, with the CMS stopped. Test writes always roll back.
const assert = require('node:assert/strict');
const path = require('node:path');
const { createStrapi } = require('@strapi/strapi');
const {
  migratePurchaseAssurance,
  content,
  populate,
} = require('../src/migrations/purchase-assurance');

async function main() {
  process.env.SEED_DEMO = 'false';
  const app = createStrapi({ appDir: process.cwd(), distDir: path.resolve('dist') });
  const rollback = new Error('Expected test rollback');
  try {
    await app.load();
    const manager = app.plugin('content-manager').service('content-types');
    const editorModel = manager.findContentType('api::storefront.storefront');
    const editorConfig = await manager.findConfiguration(editorModel);
    const editFields = editorConfig.layouts.edit.flat().map((field) => field.name);
    assert.ok(editFields.includes('purchaseAssurance'));
    assert.equal(editorModel.attributes.purchaseAssurance.type, 'component');
    for (const field of ['purchaseAssuranceLegacy', 'purchaseAssuranceMigrated']) {
      assert.ok(!(field in editorModel.attributes), `${field} must not be exposed to the editor`);
      assert.ok(!editFields.includes(field), `${field} must not appear in the edit layout`);
    }
    const query = app.db.query('api::storefront.storefront');
    const initial = await query.findMany({ populate });
    try {
      await app.db.transaction(async () => {
        const source = initial.find((row) => row.purchaseAssurance);
        assert.ok(source, 'Create a storefront with purchase assurance before running this check');
        const { id, purchaseAssurance, ...base } = source;
        const documentId = `assurance-test-${Date.now()}`;
        const fixtures = [];
        for (const published of [false, true]) {
          const legacy = content(purchaseAssurance);
          legacy.shippingNotice = published ? 'Published shipping' : 'Draft shipping';
          fixtures.push(
            await query.create({
              data: {
                ...base,
                documentId,
                publishedAt: published ? new Date() : null,
                purchaseAssuranceLegacy: legacy,
                purchaseAssuranceMigrated: false,
              },
            }),
          );
        }
        await migratePurchaseAssurance(app);
        const migrated = await query.findMany({ where: { documentId }, populate });
        for (const row of migrated) {
          const before = fixtures.find((fixture) => fixture.id === row.id);
          assert.deepEqual(content(row.purchaseAssurance), before.purchaseAssuranceLegacy);
          assert.deepEqual(row.purchaseAssuranceLegacy, before.purchaseAssuranceLegacy);
          assert.deepEqual(row.updatedAt, before.updatedAt);
          assert.equal(row.purchaseAssuranceMigrated, true);
        }
        await migratePurchaseAssurance(app);
        assert.deepEqual(await query.findMany({ where: { documentId }, populate }), migrated);

        const draft = migrated.find((row) => !row.publishedAt);
        const published = migrated.find((row) => row.publishedAt);
        const docs = app.documents('api::storefront.storefront');
        for (const field of ['shippingNotice', 'benefits', 'paymentMethods']) {
          const before = await query.findOne({ where: { id: draft.id }, populate });
          const value = structuredClone(before.purchaseAssurance);
          if (field === 'shippingNotice') value.shippingNotice += ' edited';
          if (field === 'benefits') value.benefits[0].text += ' edited';
          if (field === 'paymentMethods') value.paymentMethods[0].name += ' edited';
          await docs.update({ documentId, data: { purchaseAssurance: value } });
          const after = await query.findOne({ where: { id: draft.id }, populate });
          assert.deepEqual(content(after.purchaseAssurance), content(value));
          for (const other of ['shippingNotice', 'benefits', 'paymentMethods']) {
            if (other !== field)
              assert.deepEqual(
                content(after.purchaseAssurance)[other],
                content(before.purchaseAssurance)[other],
              );
          }
          assert.deepEqual(
            await query.findOne({ where: { id: published.id }, populate }),
            published,
          );
        }
        await query.update({ where: { id: draft.id }, data: { purchaseAssurance: null } });
        await migratePurchaseAssurance(app);
        assert.equal(
          (await query.findOne({ where: { id: draft.id }, populate })).purchaseAssurance,
          null,
        );
        throw rollback;
      });
    } catch (error) {
      if (error !== rollback) throw error;
    }
    assert.deepEqual(await query.findMany({ populate }), initial);
    console.log(
      'PASS: native editor component layout, hidden migration fields, independent draft/published migration, timestamps, idempotency, native document edits for all three fields, intentional removal, and rollback.',
    );
  } finally {
    await app.destroy();
  }
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
