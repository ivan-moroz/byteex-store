const assert = require('node:assert/strict');

const uid = 'api::storefront.storefront';
const populate = { purchaseAssurance: { populate: ['benefits', 'paymentMethods'] } };

// Reject incompatible legacy content rather than silently discarding editor data.
function content(value) {
  if (value == null) return value;
  const result = {
    shippingNotice: value.shippingNotice,
    benefits: value.benefits.map(({ text, icon }) => ({ text, icon })),
    paymentMethods: value.paymentMethods.map(({ name, imageUrl }) => ({ name, imageUrl })),
  };
  assert.equal(typeof result.shippingNotice, 'string');
  for (const benefit of result.benefits) {
    assert.equal(typeof benefit.text, 'string');
    assert.ok(['truck', 'shield', 'cart'].includes(benefit.icon));
  }
  for (const method of result.paymentMethods) {
    assert.equal(typeof method.name, 'string');
    assert.equal(typeof method.imageUrl, 'string');
    assert.ok(method.imageUrl.length);
  }
  return result;
}

function link(id, field, component) {
  return { id, __pivot: { field, component_type: component } };
}

async function createAssurance(strapi, value) {
  const data = { shippingNotice: value.shippingNotice };
  for (const [field, component] of [
    ['benefits', 'content.assurance-benefit'],
    ['paymentMethods', 'content.payment-method'],
  ]) {
    data[field] = [];
    for (const item of value[field]) {
      const row = await strapi.db.query(component).create({ data: { ...item } });
      data[field].push(link(row.id, field, component));
    }
  }
  return strapi.db.query('content.purchase-assurance').create({ data });
}

async function migratePurchaseAssurance(strapi) {
  // Query Engine targets each physical row: publishing the draft here would overwrite
  // the independently edited published version. All component writes share one transaction.
  await strapi.db.transaction(async ({ trx }) => {
    const query = strapi.db.query(uid);
    const entries = await query.findMany({ populate });
    for (const entry of entries) {
      if (entry.purchaseAssuranceMigrated || entry.purchaseAssuranceLegacy == null) continue;
      const source = content(entry.purchaseAssuranceLegacy);
      assert.deepEqual(
        source,
        entry.purchaseAssuranceLegacy,
        'Unsupported legacy assurance fields',
      );
      if (entry.purchaseAssurance) {
        assert.deepEqual(content(entry.purchaseAssurance), source);
      } else {
        const component = await createAssurance(strapi, source);
        await query.update({
          where: { id: entry.id },
          data: {
            purchaseAssurance: link(
              component.id,
              'purchaseAssurance',
              'content.purchase-assurance',
            ),
            updatedAt: entry.updatedAt,
          },
        });
      }
      const migrated = await query.findOne({ where: { id: entry.id }, populate });
      assert.deepEqual(content(migrated.purchaseAssurance), source);
      await query.update({
        where: { id: entry.id },
        data: { purchaseAssuranceMigrated: true, updatedAt: entry.updatedAt },
      });
      // Query Engine's timestamp lifecycle overrides supplied updatedAt values.
      await strapi.db
        .connection('storefronts')
        .transacting(trx)
        .where({ id: entry.id })
        .update({ updated_at: new Date(entry.updatedAt) });
      strapi.log.info(`Migrated purchase assurance for storefront row ${entry.id}.`);
    }
  });
}

module.exports = { migratePurchaseAssurance, content, populate };
