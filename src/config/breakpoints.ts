// Single source for responsive CSS and TypeScript. Restart Next.js after changing it.
export const MOBILE_MAX_WIDTH = 700;
export const DESKTOP_MIN_WIDTH = MOBILE_MAX_WIDTH + 1;

export const MOBILE_MEDIA_QUERY = `(max-width: ${MOBILE_MAX_WIDTH}px)`;

// Next.js prepends these declarations to each Sass entry at build time.
export const SASS_BREAKPOINTS = `
$mobile-max-width: ${MOBILE_MAX_WIDTH}px;
$desktop-min-width: ${DESKTOP_MIN_WIDTH}px;
`;
