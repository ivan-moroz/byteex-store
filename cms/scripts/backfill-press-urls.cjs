// Run from cms/ after Strapi has loaded the updated press schema.
// Fill only missing URLs on recognized seed logos, preserving all editorial changes.
const { createStrapi } = require('@strapi/strapi');
const fs = require('node:fs');
const path = require('node:path');
async function main() {
  process.env.SEED_DEMO = 'false';
  const seed = JSON.parse(fs.readFileSync(path.resolve('../content/seed.json'), 'utf8'));
  const app = createStrapi({ appDir: process.cwd(), distDir: path.resolve('dist') });
  try {
    await app.load();
    const query = app.db.query('content.press');
    const logos = await query.findMany({ populate: ['image'] });
    let count = 0;
    for (const logo of logos) {
      const original = seed.storefront.press.find(
        (item) => item.name === logo.name && item.image.asset === logo.image?.name,
      );
      if (logo.url || !original?.url) continue;
      await query.update({ where: { id: logo.id }, data: { url: original.url } });
      count++;
    }
    console.log(`Filled ${count} missing press URLs. Existing URLs and other fields preserved.`);
  } finally {
    await app.destroy();
  }
}
main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
