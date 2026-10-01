// Run in cms/ with Strapi stopped. Bootstrap performs the idempotent migration.
const { createStrapi } = require('@strapi/strapi');
const path = require('node:path');
async function main() {
  process.env.SEED_DEMO = 'false';
  const app = createStrapi({ appDir: process.cwd(), distDir: path.resolve('dist') });
  try {
    await app.load();
    console.log('Purchase assurance migration complete; existing editor content preserved.');
  } finally {
    await app.destroy();
  }
}
main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
