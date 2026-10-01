'use client';

import { MOBILE_MEDIA_QUERY } from '@/config/breakpoints';
import { useLayoutEffect, useId, useRef, useState } from 'react';
import type { Storefront } from '@/lib/content-schema';
import { pressPageSize } from '@/lib/press-pagination';
import { MediaImage } from './MediaImage';
import styles from './styles/PressGallery.module.scss';

export function PressGallery({ items, label }: { items: Storefront['press']; label: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const trackId = useId();
  const measureRef = useRef<HTMLSpanElement>(null);
  const [pageSize, setPageSize] = useState(0);
  const [page, setPage] = useState(0);
  const pageCount = pageSize ? Math.ceil(items.length / pageSize) : 0;
  const active = Math.min(page, Math.max(0, pageCount - 1));
  const visibleItems = items.slice(active * pageSize, (active + 1) * pageSize);

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => {
      const style = getComputedStyle(track);
      const available =
        track.getBoundingClientRect().width -
        (parseFloat(style.borderLeftWidth) || 0) -
        (parseFloat(style.borderRightWidth) || 0) -
        (parseFloat(style.paddingLeft) || 0) -
        (parseFloat(style.paddingRight) || 0);
      const size = pressPageSize(
        available,
        measureRef.current?.getBoundingClientRect().width || 0,
        parseFloat(style.columnGap) || 0,
        items.length,
      );
      setPageSize(size);
      setPage((current) =>
        Math.min(current, Math.max(0, size ? Math.ceil(items.length / size) - 1 : 0)),
      );
    };
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    if (measureRef.current) observer.observe(measureRef.current);
    measure();
    return () => observer.disconnect();
  }, [items.length]);

  return (
    <div
      className={styles.pressGallery}
      role="region"
      aria-label={label}
      aria-roledescription="carousel"
    >
      <div className={styles.pressLogos} id={trackId} ref={trackRef}>
        <span
          className={`${styles.pressLogo} ${styles.pressMeasure}`}
          ref={measureRef}
          aria-hidden="true"
        />
        {visibleItems.map((item, index) => {
          const image = (
            <MediaImage media={item.image} sizes={`${MOBILE_MEDIA_QUERY} 115px, 18vw`} />
          );
          return item.url ? (
            <a
              className={styles.pressLogo}
              key={`${item.name}-${index}`}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${item.name} (opens in a new tab)`}
            >
              {image}
            </a>
          ) : (
            <span className={styles.pressLogo} key={`${item.name}-${index}`}>
              {image}
            </span>
          );
        })}
      </div>
      {pageCount > 1 && (
        <div className={styles.pressDots} role="group" aria-label="Press logo navigation">
          {Array.from({ length: pageCount }, (_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Go to press page ${index + 1}`}
              aria-controls={trackId}
              aria-pressed={active === index}
              onClick={() => setPage(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
