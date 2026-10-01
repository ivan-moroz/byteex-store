import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import * as sass from 'sass';
import {
  MOBILE_MAX_WIDTH,
  DESKTOP_MIN_WIDTH,
  MOBILE_MEDIA_QUERY,
  SASS_BREAKPOINTS,
} from '../src/config/breakpoints.ts';

test('Sass and TypeScript share the same inclusive mobile boundary', () => {
  const css = sass.compileString(`${SASS_BREAKPOINTS}
    @media (max-width: $mobile-max-width) { .mobile { display: block; } }
    @media (min-width: $desktop-min-width) { .desktop { display: block; } }
  `).css;
  const cssMobile = Number(css.match(/max-width: ([\d.]+)px/)[1]);
  const cssDesktop = Number(css.match(/min-width: ([\d.]+)px/)[1]);
  const jsMobile = Number(MOBILE_MEDIA_QUERY.match(/max-width: ([\d.]+)px/)[1]);
  assert.equal(cssMobile, jsMobile);
  assert.equal(cssDesktop, DESKTOP_MIN_WIDTH);
  for (const [width, mobile, desktop] of [
    [MOBILE_MAX_WIDTH - 1, true, false],
    [MOBILE_MAX_WIDTH, true, false],
    [MOBILE_MAX_WIDTH + 1, false, true],
  ]) {
    assert.equal(width <= cssMobile, mobile, `CSS mobile at ${width}px`);
    assert.equal(width <= jsMobile, mobile, `TypeScript mobile at ${width}px`);
    assert.equal(width >= cssDesktop, desktop, `CSS desktop at ${width}px`);
  }
});

test('every Sass entry compiles with the shared declarations and has no literal mobile query', async () => {
  const root = new URL('../src/', import.meta.url);
  const files = await readdir(root, { recursive: true });
  for (const file of files.filter((name) => /\.(scss|tsx?)$/.test(name))) {
    const url = new URL(file.replaceAll('\\', '/'), root);
    const source = await readFile(url, 'utf8');
    assert.doesNotMatch(source, /\((?:min|max)-width:\s*70[01]px\)/, file);
    if (file.endsWith('.scss') && !path.basename(file).startsWith('_')) {
      const css = sass.compileString(SASS_BREAKPOINTS + source, { url }).css;
      if (source.includes('$mobile-max-width')) assert.ok(css.includes(MOBILE_MEDIA_QUERY), file);
      if (source.includes('$desktop-min-width')) {
        assert.ok(css.includes(`(min-width: ${DESKTOP_MIN_WIDTH}px)`), file);
      }
    }
  }
});
