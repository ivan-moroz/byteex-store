# Byteex Store

A responsive Next.js product catalog and product landing page backed by **Strapi 5 and PostgreSQL**. The product page follows the supplied Byteex desktop/mobile Figma composition. The catalog uses the same typography, navy/cream palette and photography.

**Strapi is the only CMS.** The references to Sanity in the original brief are superseded by the specified Strapi stack. There is no Sanity Studio or Sanity schema configuration in this project.

## Prerequisites

- Node.js **24 LTS** (tested with 24.19.0).
- pnpm **11.25.0**: `npm install --global pnpm@11.25.0`.
- PostgreSQL **17 or 18** (tested with an existing PostgreSQL 18 database).
- Git. A modern browser for the Strapi admin panel and storefront.
- Two terminal windows: one for Strapi and one for Next.js.

Do not use the generated `node_modules`, `.next`, `cms/dist`, or upload directories from another machine. Install from the committed lockfiles.

## 1. Clone and install

```sh
git clone <repository-url>
cd byteex-store
pnpm install --frozen-lockfile
cd cms
pnpm install --frozen-lockfile
cd ..
node scripts/setup-env.mjs
```

The setup script creates `.env.local` and `cms/.env`, fills missing settings from their examples, and generates random Strapi secrets. Existing configured values are preserved. These files are ignored by Git. Run this command from the repository root.

This is a repository with two independently installed applications, not a shared dependency workspace. The root is Next.js; `cms/` is Strapi. Run each application's commands in its own directory.

The CMS pins `pg` to `8.16.3` for compatibility with Strapi's Knex 3.0.1 transaction queries. Newer `pg` versions such as 8.23.0 warn about the concurrent queries that this Knex/Strapi combination queues on a single connection. This pin is a compatibility workaround, not a change to Strapi's query scheduling; revisit it when upgrading Strapi/Knex. After dependency changes, restart `pnpm develop` so the process loads the installed driver.

## 2. Configure PostgreSQL

Use a dedicated database. If `byteex_store` already exists, configure its existing user and password; do not recreate it. Otherwise, as a PostgreSQL administrator:

```sh
createuser --host 127.0.0.1 --username postgres --pwprompt byteex
createdb --host 127.0.0.1 --username postgres --owner byteex byteex_store
```

The database user needs permission to create and alter tables in this database so Strapi can maintain its schema. It does not need PostgreSQL superuser privileges.

Edit **`cms/.env`**:

```dotenv
HOST=127.0.0.1
PORT=1337
DATABASE_HOST=127.0.0.1
DATABASE_PORT=5432
DATABASE_NAME=byteex_store
DATABASE_USERNAME=byteex
DATABASE_PASSWORD=your-local-database-password
DATABASE_SSL=false
SEED_DEMO=true
```

Keep the generated `APP_KEYS`, `ADMIN_JWT_SECRET`, `API_TOKEN_SALT`, `TRANSFER_TOKEN_SALT`, `JWT_SECRET`, and `ENCRYPTION_KEY`. Do not replace the whole file with just the database settings. `node scripts/setup-env.mjs` can restore missing settings without printing secrets.

Set `DATABASE_SSL=true` when required by your database provider. Configure its trusted CA appropriately rather than disabling certificate verification.

## 3. Start Strapi and load the sample content

In terminal 1:

```sh
cd cms
pnpm develop
```

With `SEED_DEMO=true`, the first startup uploads the bundled Figma assets to the Strapi Media Library and publishes six sample products and the Storefront single type. The sample product names/categories and descriptions for the additional catalog items are demonstration content. Lorem ipsum and the founder placeholder are deliberately retained where present in Figma; replace them in the CMS for a real store.

After a successful seed, set `SEED_DEMO=false`. The seed preserves existing editor content and skips existing products by slug and an existing Storefront. Do not delete the database to reset a sample. Manage content through the admin panel instead.

Open **[Strapi Admin](http://127.0.0.1:1337/admin)**. On first launch, create your own local administrator using the registration form. On later launches, log in with that account. No shared admin password is stored in the repository.

## 4. Connect Next.js to Strapi

You can use either the admin panel or the optional local setup script.

### Admin panel setup

1. Open **Settings → API Tokens → Create new API Token**.
2. Choose a **Content API** token (if a token-kind selector is shown).
3. Use a **Custom** token with only these actions: Product `find`, Product `findOne`, Storefront `find`. A read-only token also works, but the custom option grants only what this site uses.
4. Copy the generated token into `STRAPI_API_TOKEN` in the root `.env.local`.
5. Keep Public role write permissions disabled. The browser never receives this token; Next.js calls Strapi on the server.

### Optional local setup script

After a successful Strapi startup (or `pnpm build` in `cms/`), run from a separate terminal:

```sh
cd cms
node scripts/connect-frontend.cjs
cd ..
```

The script connects to the configured local CMS database, creates a token limited to the three content-read actions above, and writes it directly to the root `.env.local` without printing its value. It preserves an existing frontend token and does not create an admin account. The token can be revoked in Strapi Settings → API Tokens. Use the admin panel workflow for remote/deployed environments.

Root **`.env.local`**:

```dotenv
STRAPI_URL=http://127.0.0.1:1337
STRAPI_API_TOKEN=your-strapi-content-api-token
SITE_URL=http://localhost:3000
DEMO_MODE=false
```

`STRAPI_URL` is the CMS origin, without `/api`. `SITE_URL` is the public storefront origin used for metadata. Keep `STRAPI_API_TOKEN` server-only: never prefix it with `NEXT_PUBLIC_`.

## 5. Run Next.js

In terminal 2, from the repository root:

```sh
pnpm dev
```

- Catalog: **http://127.0.0.1:3000/products**
- Figma product page: **http://127.0.0.1:3000/products/white-robe**
- Other products: `/products/<published-slug>`
- Root `/` redirects to the catalog.
- Admin: **http://127.0.0.1:1337/admin**

Both servers must remain running. Restart Next.js after changing connection variables. REST requests are server-rendered and use `cache: 'no-store'`, so published CMS changes appear on the next page refresh without a frontend rebuild. React request memoization avoids duplicate reads during a single render.

### Explicit visual preview mode

For frontend-only work without a database, set `DEMO_MODE=true` in `.env.local` and start Next.js. This reads `content/seed.json` and bundled images. **Preview mode is not the CMS integration**: admin edits will not appear until `DEMO_MODE=false`. There is no automatic fallback to sample data on a CMS error.

## Managing content

### Products

Go to **Content Manager → Collection Types → Product**. Create or edit:

| Field            | Purpose                                                                            |
| ---------------- | ---------------------------------------------------------------------------------- |
| `title`, `slug`  | Catalog title, metadata and product URL; use unique slugs.                         |
| `category`       | Catalog filter; matching text groups products.                                     |
| `description`    | Catalog copy and SEO description.                                                  |
| `heroHeading`    | Main heading on the individual product page.                                       |
| `heroImages`     | At least **three** images, ordered left/center/right for the hero collage.         |
| `gallery`        | At least **one** image. The first is the catalog cover; all appear in the gallery. |
| `galleryCaption` | Caption below the gallery.                                                         |
| `sortOrder`      | Ascending position in the catalog.                                                 |

Use the media picker to upload or select images. Set meaningful alternative text in the Media Library. Preserve portrait compositions for hero/gallery imagery. Save changes and **Publish**. Draft-only or unpublished products do not appear on the site. An unknown slug renders the not-found page.

### Shared page content

Go to **Content Manager → Single Types → Storefront**. This content is shared by all product landing pages:

- Brand name, desktop/mobile announcement, catalog title/intro, filter and card labels.
- CTA label and internal link (`/products` by default), review label.
- Hero benefits and featured review.
- Press names/logos, benefits heading and icon/text rows.
- Story heading, paragraphs (blank lines separate paragraphs), three ordered story images.
- Process heading and repeatable steps.
- Review heading/intro, community images, repeatable testimonials.
- FAQ heading, questions/answers and three ordered decorative images.
- Impact heading/values/labels/icons and `showOnMobile` for each statistic.
- Final heading, separate desktop/mobile descriptions and three ordered collage images.

Reorder repeatable components and media using the admin controls. Select an icon from the supplied list. The first three images are used in each collage. Publish the single type after editing. Keep at least three images in each collage field. Empty optional descriptions are allowed for short hero benefits.

The page layout, breakpoints, CSS, and fixed accessibility/system messages remain code. Editorial text and photos are CMS-managed. No payment, inventory, cart or checkout backend is included: these were not in the supplied frames. The CTA navigates to the catalog.

## Project structure

```text
src/app/                         Next.js App Router pages, errors and layout
src/components/                  Reusable sections, gallery, carousel, catalog
src/components/Storefront.module.scss
src/app/globals.scss             Global typography and accessibility styles
src/lib/strapi.ts                Server-only REST client and explicit preview mode
src/lib/content-schema.ts        Runtime validation and TypeScript content types
cms/config/                     PostgreSQL, server, admin and middleware settings
cms/src/api/product/             Product schema, controller, service and routes
cms/src/api/storefront/          Storefront schema, controller, service and routes
cms/src/components/content/     Item, quote, FAQ, impact and press component schemas
cms/src/index.js                Opt-in, non-overwriting content seed
cms/scripts/connect-frontend.cjs Optional restricted-token setup
content/seed.json                Portable initial content / explicit visual preview
public/figma/                    Bundled optimized Figma photographs and logos
scripts/setup-env.mjs            Environment setup without exposing secrets
tests/content.test.mjs           Seed/schema/media integrity checks
docs/design-audit.md             Observed design and fidelity limitations
```

`scripts/generate-cms.mjs` and `scripts/create-content.mjs` generate the committed initial schemas and seed content. They are developer utilities, not required for normal setup; use the CMS for editorial changes. If changing a generated schema in code, update the generator as well.

## Validation and production builds

From the repository root:

```sh
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm start
```

For Strapi, in `cms/`:

```sh
pnpm build
pnpm start
```

Stop the development server on the same port before running the production server. The frontend build does not require a live CMS because content routes render at request time; browsing them does require the configured CMS.

With both development servers running on their default ports, run `node scripts/smoke-test.cjs` from `cms/` to verify anonymous access is disabled, the frontend token cannot write, and a published CMS edit reaches the frontend. This creates and removes one temporary test product; existing products are preserved.

For deployment, provide production environment variables, a persistent PostgreSQL database, persistent media storage (or a configured upload provider), and HTTPS origins. Update `STRAPI_URL` and `SITE_URL`. `next.config.ts` restricts image optimization to `/uploads/**` on the configured CMS host. Loopback CMS origins are explicitly supported for local production testing; use a reachable production CMS origin when deploying.

## Troubleshooting

The desktop-only shipping/payment assurance strip is configured in **Storefront → purchaseAssurance** (JSON): `shippingNotice`, `paymentMethods` (`name`, `imageUrl`), and `benefits` (`text`, `icon`: `truck`, `shield`, or `cart`). Use `\n` for intentional line breaks. Image URLs can reference bundled `/payments/` assets or your configured Strapi media URLs. Publish changes as usual. The strip is hidden at 700px and below. Existing databases can initialize only this missing field with `node scripts/backfill-purchase-assurance.cjs` from `cms/` after rebuilding/restarting Strapi; existing values and other draft/published content are preserved.

Payment SVGs come from [ActiveMerchant payment_icons](https://github.com/activemerchant/payment_icons) with the license included in `public/payments/MIT-LICENSE`. They are display assets; the project does not implement payment processing.

Press logos are managed in **Content Manager → Storefront → press**. Each entry has a name, image and required absolute `http://` or `https://` URL. Publish the entry after editing. Links open in a new tab. The gallery displays paginated groups of whole logos, sized from the available container width, logo width, and gap. Centered dots select a group without sliding or scrolling; they disappear when all logos fit. ResizeObserver recalculates capacity and clamps the current page after resizing. Keyboard access to dots and links remains available.

For an existing database, restart Strapi to load the new `content.press.url` field, then run `node scripts/backfill-press-urls.cjs` from `cms/`. It fills only missing URLs for recognized seed logos in existing draft/published component rows, without publishing other draft changes or overwriting configured destinations. Set URLs manually for custom logos. Legacy entries with missing/invalid URLs remain visible without a clickable link.

| Symptom                              | Check                                                                                                                        |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| PostgreSQL password/connection error | Database service, port, database name and credentials in `cms/.env`.                                                         |
| `App keys are required`              | Keep all generated Strapi secrets; run `node scripts/setup-env.mjs` from the root.                                           |
| API 401/403                          | Token kind/permissions, token value and expiration; restart Next.js.                                                         |
| Generic frontend error               | Read the Next.js server terminal. Check Strapi is running, Storefront is published, and required media fields are populated. |
| Admin edits do not appear            | Set `DEMO_MODE=false`, publish changes and refresh the page.                                                                 |
| Images fail                          | Confirm the CMS origin and `/uploads/` URLs are reachable; keep the upload directory persistent.                             |
| Seed skipped                         | Existing content is preserved intentionally. Manage it in the admin; seeding never resets the database.                      |
| Port already in use                  | Stop the previous server or adjust the port and corresponding URL.                                                           |

## Design notes

Figma: [desktop](https://www.figma.com/design/S2YR3ijlPpGp9KWx4jl0qz/Byteex---Standard-Development-Test?node-id=1-1166) · [mobile](https://www.figma.com/design/S2YR3ijlPpGp9KWx4jl0qz/Byteex---Standard-Development-Test?node-id=1-1633).

Original Figma photos are bundled as WebP and imported into Strapi by the seed. Guest Figma access allowed visual inspection, but not exact font/variable inspection. Typography, vector icons and some secondary image arrangements need final comparison with authenticated Figma inspect access; this implementation does not claim pixel-perfect verification. See `docs/design-audit.md` for the audit and remaining differences.

The Git history records separate implementation stages. Repository publishing, collaborator invitations and submission email are separate handoff actions; no deployment or email is performed by the application.
