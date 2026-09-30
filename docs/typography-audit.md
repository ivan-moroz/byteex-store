# Typography audit — 2026-09-30

## Status and source

Source: [Byteex Figma design](https://www.figma.com/design/S2YR3ijlPpGp9KWx4jl0qz/Byteex---Standard-Development-Test?node-id=1-1166), desktop `1:1166` and mobile `1:1633`.

The file opens in the guest viewer. Its UI says “Sign up to comment, edit, inspect and more.” Text properties are not accessible in this session. Consequently, the exact Figma families, weights, italics, sizes, line heights and tracking remain unverified. The existing design audit also records that initial typography was estimated visually. Do not treat the implementation inventory below as Figma specifications.

No font files were downloaded and no application styles were changed during this audit. Authenticated inspection or an export of the text properties is needed before accurate implementation and comparison can continue.

## Existing configuration

- `src/app/layout.tsx` imports `globals.scss`; it has no `next/font` configuration.
- `src/app/globals.scss` uses `'Century Gothic', 'Avenir Next', Arial, sans-serif`, 15px and weight 400 for body text. These are system font requests, not bundled fonts. Appearance therefore depends on the fonts installed on the viewer's device.
- Global h1–h3 use weight 500 and tracking `0.035em`; paragraphs use line-height `1.65`. Form controls inherit their font.
- `src/components/Storefront.module.scss` uses Arial at weight 900 for the wordmark and weight 200 for arrow controls. Impact values use semantic `strong`, whose weight is not explicitly overridden.
- No explicit italic declarations or italic text elements were found in the frontend source.
- No WOFF, WOFF2, TTF or OTF files were found in the project source/assets.
- There are no shared font-family or typography scale tokens yet. Most component typography lives in the single Storefront CSS module.

## Current component inventory

Sizes below are CSS pixels. They are current implementation values, not approved design values.

| Area | Desktop | Mobile (max-width: 700px) |
| --- | --- | --- |
| Wordmark | 48, Arial 900, line-height 1, tracking -1.5px | 46 |
| Hero heading | 38, line-height 1.25 | 28, line-height 1.25 |
| Hero benefit text | 14, line-height 1.65 | 13, line-height 1.55 |
| CTA button | 18 | 17 |
| Rating label | 12, line-height 1.5, tracking 0 | Inherits shared rating styles |
| Benefits heading / item title / description | 30 / 22 / 14 | 25 / 21 / 13 |
| Story heading / body | 30 / 14 | 25 / 13 |
| Process heading / card title / body | 30 / 22 / 14 | 25 / 22 / 14 |
| Reviews heading / introduction | 30 / 14 | 25 / 13 |
| FAQ heading / question / answer | 30 / 17 / 14 | 25 / 15 / 13 |
| Impact heading / value / label | 25 / 20 / 13 | 24 / 20 / 12 |
| Final CTA heading | Shared section intro: 30 | 25 |
| Purchase assurance notice / benefits | 10 / 14 | Section hidden by existing design rule |
| Catalog heading / product heading | 46 / 23 | 34 / 23 |
| Catalog filter labels | 13 | 12 |

Tablet overrides include a 31px hero heading between 701px and 1100px. Existing breakpoints and component-specific tracking/line heights must be retained until the corresponding Figma text properties are available. Press publication marks and payment marks are image assets; changing the body font will not change their embedded lettering.

## Remaining implementation and verification

1. Inspect all desktop/mobile text layers, including per-range font overrides, and record family, weight, style, size, line-height and letter-spacing.
2. Confirm each identified font's official source and permission for self-hosted web use. A locally installed system font alone does not establish redistribution permission. No particular Figma font is currently known to be unavailable or prohibited; identification and licensing are still pending.
3. Obtain only required licensed variants, preferably WOFF2, with applicable license/attribution files. Do not add Medium, SemiBold, Bold or Italic merely because they are examples in the request.
4. Configure one shared `next/font/local` declaration through the root layout, using explicit variant metadata, and reuse CSS variables for shared typography. Read the installed Next.js font documentation before implementation.
5. Apply verified typography to shared components and local overrides without changing carousel behavior, layout rules or CMS data.
6. Compare the rendered page with both Figma frames and verify wrapping, clipping and controls at desktop, tablet and mobile widths, including either side of the existing 700px breakpoint.

No post-implementation visual validation or font-loading validation has been performed, because implementation is awaiting the source specifications.
