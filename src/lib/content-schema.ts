import { z } from 'zod';
export const imageSchema = z.object({
  url: z.string().min(1),
  alternativeText: z.string().nullable().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
});
const itemSchema = z.object({
  title: z.string(),
  description: z.string().nullable().optional(),
  icon: z.enum(['sun', 'leaf', 'waves', 'cart', 'truck', 'cloud', 'water', 'bolt']),
});
const quoteSchema = z.object({
  name: z.string(),
  text: z.string(),
  rating: z.number().min(1).max(5),
  avatar: imageSchema,
});
// Legacy entries without destinations remain visible; unsafe schemes never become links.
export const pressSchema = z.object({
  name: z.string(),
  image: imageSchema,
  url: z
    .string()
    .trim()
    .url()
    .refine((value) => /^https?:\/\//i.test(value))
    .nullish()
    .catch(null),
});
export const productSchema = z.object({
  title: z.string(),
  slug: z.string(),
  category: z.string(),
  description: z.string(),
  heroHeading: z.string(),
  heroImages: z.array(imageSchema).min(3),
  gallery: z.array(imageSchema).min(1),
  galleryCaption: z.string(),
  sortOrder: z.number().optional(),
});
export const storefrontSchema = z.object({
  purchaseAssurance: z
    .object({
      shippingNotice: z.string(),
      paymentMethods: z.array(z.object({ name: z.string(), imageUrl: z.string().min(1) })),
      benefits: z.array(z.object({ text: z.string(), icon: z.enum(['truck', 'shield', 'cart']) })),
    })
    .nullish(),
  brandName: z.string(),
  announcement: z.string(),
  mobileAnnouncement: z.string(),
  catalogLinkLabel: z.string(),
  catalogHeading: z.string(),
  catalogDescription: z.string(),
  allCategoryLabel: z.string(),
  viewProductLabel: z.string(),
  emptyCatalogMessage: z.string(),
  ctaLabel: z.string(),
  ctaHref: z.string().refine((v) => v.startsWith('/') && !v.startsWith('//'), 'Use a local path'),
  reviewLabel: z.string(),
  pressLabel: z.string(),
  benefitsHeading: z.string(),
  storyHeading: z.string(),
  storyBody: z.string(),
  processHeading: z.string(),
  reviewsHeading: z.string(),
  reviewsDescription: z.string(),
  faqHeading: z.string(),
  impactHeading: z.string(),
  finalHeading: z.string(),
  finalDescription: z.string(),
  finalMobileDescription: z.string(),
  heroBenefits: z.array(itemSchema),
  heroReview: quoteSchema,
  press: z.array(pressSchema),
  benefits: z.array(itemSchema),
  storyImages: z.array(imageSchema).min(3),
  steps: z.array(itemSchema),
  communityImages: z.array(imageSchema),
  testimonials: z.array(quoteSchema),
  faqs: z.array(z.object({ question: z.string(), answer: z.string() })),
  faqImages: z.array(imageSchema).min(3),
  impact: z.array(
    z.object({
      value: z.string(),
      label: z.string(),
      icon: itemSchema.shape.icon,
      showOnMobile: z.boolean(),
    }),
  ),
  finalImages: z.array(imageSchema).min(3),
});
export type Media = z.infer<typeof imageSchema>;
export type Product = z.infer<typeof productSchema>;
export type Storefront = z.infer<typeof storefrontSchema>;
export type ContentItem = z.infer<typeof itemSchema>;
export type Quote = z.infer<typeof quoteSchema>;
