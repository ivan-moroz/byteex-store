'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { Storefront } from '@/lib/content-schema';
import { MediaImage } from './MediaImage';
import s from './Storefront.module.scss';

export function PressGallery({ items, label }: { items: Storefront['press']; label: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const trackId = useId();
  const [navigation, setNavigation] = useState({ overflow: false, previous: false, next: false });

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    const measure = () => {
      const maximum = Math.max(0, track.scrollWidth - track.clientWidth);
      const position = Math.max(0, Math.min(track.scrollLeft, maximum));
      const next = {
        overflow: maximum > 1,
        previous: position > 1,
        next: maximum - position > 1,
      };
      setNavigation((current) =>
        current.overflow === next.overflow &&
        current.previous === next.previous &&
        current.next === next.next
          ? current
          : next,
      );
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    const observer = new ResizeObserver(schedule);
    observer.observe(track);
    for (const child of track.children) observer.observe(child);
    track.addEventListener('scroll', schedule, { passive: true });
    track.addEventListener('load', schedule, true);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      track.removeEventListener('scroll', schedule);
      track.removeEventListener('load', schedule, true);
    };
  }, [items]);

  function move(direction: number) {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({
      left: direction * track.clientWidth,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
  }

  return (
    <div
      className={s.pressGallery}
      role="region"
      aria-label={label}
      aria-roledescription="carousel"
    >
      {navigation.overflow && (
        <button
          type="button"
          className={`${s.previous} ${s.pressPrevious}`}
          aria-label="Previous press logos"
          aria-controls={trackId}
          disabled={!navigation.previous}
          onClick={() => move(-1)}
        >
          ‹
        </button>
      )}
      <div className={s.pressLogos} id={trackId} ref={trackRef}>
        {items.map((item, index) => {
          const image = <MediaImage media={item.image} sizes="(max-width:700px) 115px, 18vw" />;
          return item.url ? (
            <a
              className={s.pressLogo}
              key={`${item.name}-${index}`}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${item.name} (opens in a new tab)`}
            >
              {image}
            </a>
          ) : (
            <span className={s.pressLogo} key={`${item.name}-${index}`}>
              {image}
            </span>
          );
        })}
      </div>
      {navigation.overflow && (
        <button
          type="button"
          className={`${s.next} ${s.pressNext}`}
          aria-label="Next press logos"
          aria-controls={trackId}
          disabled={!navigation.next}
          onClick={() => move(1)}
        >
          ›
        </button>
      )}
    </div>
  );
}
