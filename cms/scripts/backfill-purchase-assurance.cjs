// Run in cms/ after building/restarting Strapi with the new schema.
const { createStrapi } = require('@strapi/strapi');
const fs = require('node:fs');
const path = require('node:path');
async function main() {
  process.env.SEED_DEMO = 'false';
  const content = JSON.parse(fs.readFileSync(path.resolve('../content/seed.json'), 'utf8'))
    .storefront.purchaseAssurance;
  const app = createStrapi({ appDir: process.cwd(), distDir: path.resolve('dist') });
  try {
    await app.load();
    const query = app.db.query('api::storefront.storefront');
    const entries = await query.findMany();
    let count = 0;
    for (const entry of entries) {
      if (entry.purchaseAssurance != null) continue;
      await query.update({ where: { id: entry.id }, data: { purchaseAssurance: content } });
      count++;
    }
    console.log(`Added purchase assurance to ${count} entries; existing content preserved.`);
  } finally {
    await app.destroy();
  }
}
main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
