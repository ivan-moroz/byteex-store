# Verification — 2026-09-29

## Press gallery update

Next.js and Strapi production builds, ESLint, and six content/URL tests passed. The live Strapi API returns four logo URLs; server-rendered product HTML contains all four CMS destinations with `target="_blank"` and `rel="noopener noreferrer"`. The URL backfill filled eight missing values across draft/published component rows without changing existing URLs or other content.

The gallery measures actual overflow with ResizeObserver, observes logo sizes, and refreshes navigation state after scroll/load and CMS item changes. Existing mobile and desktop logo dimensions, gaps, opacity and background are retained; mobile arrows use a separate row only when needed. The existing carousel's arrow styles and MediaImage are reused; no dependency was added.

The browser tool was disconnected during this update and Figma could not be reopened through the web tool. Fresh visual comparison, resize/scroll interaction checks, and Safari/Firefox checks remain unverified. The earlier browser checks below apply to the original page, not this new gallery behavior.

## Original implementation

- Next.js production build and TypeScript validation passed.
- Strapi production admin build passed.
- ESLint and all three content-integrity tests passed.
- Live PostgreSQL / Strapi integration smoke test passed: unauthenticated reads rejected, frontend token writes rejected, published test product rendered, edited heading appeared on the next request. The temporary product was removed.
- Browser checks: catalog category filtering, product navigation, gallery selection, mobile carousel, FAQ expansion, and responsive layouts at 375, 428, 768 and 1440px. No document horizontal overflow at the checked widths.
- Screenshots: `screenshots/product-desktop.png` and `screenshots/product-mobile.png`.

The frontend uses live Strapi content locally (`DEMO_MODE=false`). Account registration is performed by the owner; credentials and API tokens are excluded from Git. Exact Figma fidelity limitations are documented in `design-audit.md`. Safari and Firefox were not tested.
