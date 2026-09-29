import 'server-only';
import { cache } from 'react';
import { productSchema, storefrontSchema, type Product, type Storefront } from './content-schema';
const origin = process.env.STRAPI_URL || 'http://127.0.0.1:1337';
const productQuery = 'populate[heroImages]=true&populate[gallery]=true';
const storeQuery = [
  'heroBenefits',
  'benefits',
  'steps',
  'faqs',
  'impact',
  'storyImages',
  'communityImages',
  'faqImages',
  'finalImages',
]
  .map((field) => `populate[${field}]=true`)
  .concat([
    'populate[heroReview][populate][avatar]=true',
    'populate[testimonials][populate][avatar]=true',
    'populate[press][populate][image]=true',
  ])
  .join('&');
function normalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(normalize);
  if (value && typeof value === 'object')
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        key === 'url' && typeof item === 'string' && item.startsWith('/uploads/')
          ? new URL(item, origin).href
          : normalize(item),
      ]),
    );
  return value;
}
async function request(
  path: string,
): Promise<{ data: unknown; meta?: { pagination?: { pageCount: number } } }> {
  if (!process.env.STRAPI_API_TOKEN)
    throw new Error('STRAPI_API_TOKEN is missing. See README for CMS setup.');
  const response = await fetch(`${origin}/api/${path}`, {
    headers: { Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}` },
    cache: 'no-store',
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok)
    throw new Error(
      `Strapi request failed (${response.status}). Check CMS connection, token permissions and published content.`,
    );
  return normalize(await response.json()) as {
    data: unknown;
    meta?: { pagination?: { pageCount: number } };
  };
}
const demo = cache(async () => {
  const { default: seed } = await import('../../content/seed.json');
  function resolve(value: unknown): unknown {
    if (Array.isArray(value)) return value.map(resolve);
    if (value && typeof value === 'object') {
      if ('asset' in value)
        return {
          url: `/figma/${value.asset}`,
          alternativeText: 'alternativeText' in value ? value.alternativeText : '',
        };
      return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, resolve(v)]));
    }
    return value;
  }
  return resolve(seed) as { products: unknown[]; storefront: unknown };
});
export const getStorefront = cache(async (): Promise<Storefront> =>
  storefrontSchema.parse(
    process.env.DEMO_MODE === 'true'
      ? (await demo()).storefront
      : (await request(`storefront?${storeQuery}`)).data,
  ),
);
export const getProducts = cache(async (): Promise<Product[]> => {
  if (process.env.DEMO_MODE === 'true') return productSchema.array().parse((await demo()).products);
  const products: Product[] = [];
  for (let page = 1, pageCount = 1; page <= pageCount; page++) {
    const result = await request(
      `products?${productQuery}&sort=sortOrder:asc&pagination[page]=${page}&pagination[pageSize]=100`,
    );
    products.push(...productSchema.array().parse(result.data));
    pageCount = result.meta?.pagination?.pageCount || 1;
  }
  return products;
});
export const getProduct = cache(async (slug: string): Promise<Product | null> => {
  if (process.env.DEMO_MODE === 'true')
    return (await getProducts()).find((p) => p.slug === slug) || null;
  const result = await request(
    `products?${productQuery}&filters[slug][$eq]=${encodeURIComponent(slug)}&pagination[pageSize]=1`,
  );
  return productSchema.array().parse(result.data)[0] || null;
});
