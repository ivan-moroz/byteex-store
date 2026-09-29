// Run from cms/ after `pnpm build` or a successful `pnpm develop`.
// Creates only a content-read token; it never creates an admin account.
const { createStrapi } = require('@strapi/strapi');
const fs = require('node:fs/promises');
const path = require('node:path');
async function main() {
  const envPath = path.resolve(process.cwd(), '../.env.local');
  const env = await fs.readFile(envPath, 'utf8');
  if (/^STRAPI_API_TOKEN=.+$/m.test(env)) {
    console.log('Existing frontend token preserved.');
    return;
  }
  process.env.SEED_DEMO = 'false';
  const app = createStrapi({ appDir: process.cwd(), distDir: path.resolve('dist') });
  try {
    await app.load();
    const token = await app
      .service('admin::api-token')
      .create({
        kind: 'content-api',
        name: `byteex-nextjs-${Date.now()}`,
        description: 'Server-side storefront access: published products and page content only.',
        type: 'custom',
        lifespan: null,
        permissions: [
          'api::product.product.find',
          'api::product.product.findOne',
          'api::storefront.storefront.find',
        ],
      });
    let updated = env
      .replace(/^STRAPI_API_TOKEN=.*$/m, `STRAPI_API_TOKEN=${token.accessKey}`)
      .replace(/^DEMO_MODE=.*$/m, 'DEMO_MODE=false');
    if (!/^STRAPI_API_TOKEN=/m.test(updated)) updated += `\nSTRAPI_API_TOKEN=${token.accessKey}\n`;
    await fs.writeFile(envPath, updated);
    console.log(
      'Restricted content-read token saved directly to .env.local. Token value was not printed.',
    );
  } finally {
    await app.destroy();
  }
}
main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
