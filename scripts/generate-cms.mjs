import { mkdir, writeFile } from 'node:fs/promises';
const write = async (path, data) => {
  await mkdir(path.slice(0, path.lastIndexOf('/')), { recursive: true });
  await writeFile(path, typeof data === 'string' ? data : JSON.stringify(data, null, 2) + '\n');
};
const str = (required = true) => ({ type: 'string', required });
const text = (required = true) => ({ type: 'text', required });
const media = (multiple = false) => ({
  type: 'media',
  multiple,
  allowedTypes: ['images'],
  required: true,
});
const comp = (component, repeatable = true) => ({
  type: 'component',
  component: `content.${component}`,
  repeatable,
  required: true,
});
const components = {
  item: {
    title: str(),
    description: text(false),
    icon: {
      type: 'enumeration',
      enum: ['sun', 'leaf', 'waves', 'cart', 'truck', 'cloud', 'water', 'bolt'],
      default: 'leaf',
      required: true,
    },
  },
  quote: {
    name: str(),
    text: text(),
    rating: { type: 'integer', min: 1, max: 5, default: 5, required: true },
    avatar: media(),
  },
  faq: { question: str(), answer: text() },
  impact: {
    value: str(),
    label: str(),
    icon: { type: 'enumeration', enum: ['cloud', 'water', 'bolt'], required: true },
    showOnMobile: { type: 'boolean', default: true },
  },
  press: { name: str(), image: media() },
};
for (const [name, attributes] of Object.entries(components))
  await write(`cms/src/components/content/${name}.json`, {
    collectionName: `components_content_${name}s`,
    info: { displayName: name },
    attributes,
  });
const schemas = {
  product: {
    kind: 'collectionType',
    collectionName: 'products',
    info: { singularName: 'product', pluralName: 'products', displayName: 'Product' },
    options: { draftAndPublish: true },
    attributes: {
      title: str(),
      slug: { type: 'uid', targetField: 'title', required: true },
      category: str(),
      description: text(),
      heroHeading: str(),
      heroImages: media(true),
      gallery: media(true),
      galleryCaption: str(),
      sortOrder: { type: 'integer', default: 0 },
    },
  },
  storefront: {
    kind: 'singleType',
    collectionName: 'storefronts',
    info: { singularName: 'storefront', pluralName: 'storefronts', displayName: 'Storefront' },
    options: { draftAndPublish: true },
    attributes: {
      brandName: str(),
      announcement: text(),
      mobileAnnouncement: str(),
      catalogLinkLabel: str(),
      catalogHeading: str(),
      catalogDescription: text(),
      allCategoryLabel: str(),
      viewProductLabel: str(),
      emptyCatalogMessage: str(),
      ctaLabel: str(),
      ctaHref: str(),
      reviewLabel: str(),
      pressLabel: str(),
      benefitsHeading: str(),
      storyHeading: str(),
      storyBody: text(),
      processHeading: str(),
      reviewsHeading: str(),
      reviewsDescription: text(),
      faqHeading: str(),
      impactHeading: str(),
      finalHeading: str(),
      finalDescription: text(),
      finalMobileDescription: text(),
      heroBenefits: comp('item'),
      heroReview: comp('quote', false),
      press: comp('press'),
      benefits: comp('item'),
      storyImages: media(true),
      steps: comp('item'),
      communityImages: media(true),
      testimonials: comp('quote'),
      faqs: comp('faq'),
      faqImages: media(true),
      impact: comp('impact'),
      finalImages: media(true),
    },
  },
};
for (const [name, schema] of Object.entries(schemas)) {
  await write(`cms/src/api/${name}/content-types/${name}/schema.json`, schema);
  for (const [folder, factory] of [
    ['controllers', 'createCoreController'],
    ['services', 'createCoreService'],
    ['routes', 'createCoreRouter'],
  ])
    await write(
      `cms/src/api/${name}/${folder}/${name}.js`,
      `const { factories } = require('@strapi/strapi');\nmodule.exports = factories.${factory}('api::${name}.${name}');\n`,
    );
}
