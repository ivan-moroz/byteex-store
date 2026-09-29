const fs = require('node:fs');
const path = require('node:path');
module.exports = {
  async bootstrap({ strapi }) {
    if (process.env.SEED_DEMO !== 'true') return;
    const existingStore = await strapi.documents('api::storefront.storefront').findFirst();
    const source = JSON.parse(
      fs.readFileSync(path.resolve(process.cwd(), '../content/seed.json'), 'utf8'),
    );
    const uploads = new Map();
    async function resolve(value) {
      if (Array.isArray(value)) return Promise.all(value.map(resolve));
      if (!value || typeof value !== 'object') return value;
      if (value.asset) {
        if (!uploads.has(value.asset))
          uploads.set(
            value.asset,
            (async () => {
              const filepath = path.resolve(process.cwd(), '../public/figma', value.asset);
              const existingFile = await strapi.db
                .query('plugin::upload.file')
                .findOne({ where: { name: value.asset } });
              if (existingFile) return existingFile.id;
              const [file] = await strapi
                .plugin('upload')
                .service('upload')
                .upload({
                  data: { fileInfo: { name: value.asset, alternativeText: value.alternativeText } },
                  files: {
                    filepath,
                    originalFilename: value.asset,
                    mimetype: 'image/webp',
                    size: fs.statSync(filepath).size,
                  },
                });
              return file.id;
            })(),
          );
        return uploads.get(value.asset);
      }
      const output = {};
      for (const [key, item] of Object.entries(value)) output[key] = await resolve(item);
      return output;
    }
    for (const product of source.products) {
      const existing = await strapi
        .documents('api::product.product')
        .findFirst({ filters: { slug: product.slug } });
      if (existing) continue;
      await strapi
        .documents('api::product.product')
        .create({ data: await resolve(product), status: 'published' });
    }
    if (!existingStore)
      await strapi
        .documents('api::storefront.storefront')
        .create({ data: await resolve(source.storefront), status: 'published' });
    strapi.log.info(
      'Byteex sample content published. Public API permissions remain disabled. Create a read-only API token for Next.js.',
    );
  },
};
