'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { Storefront } from '@/lib/content-schema';
import { MediaImage } from './MediaImage';
import s from './Storefront.module.scss';

export function PressGallery({ items, label }: { items: Storefront['press']; label: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const trackId = useId();
  const [navigation, setNavigation] = useState({ stops: [0], active: 0 });

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    const measure = () => {
      const maximum = Math.max(0, track.scrollWidth - track.clientWidth);
      const position = Math.max(0, Math.min(track.scrollLeft, maximum));
      const stops = [0];
      if (maximum > 1) {
        const padding = parseFloat(getComputedStyle(track).paddingLeft) || 0;
        const left = track.getBoundingClientRect().left;
        for (const child of track.children) {
          const offset = Math.min(
            maximum,
            Math.max(0, child.getBoundingClientRect().left - left + track.scrollLeft - padding),
          );
          if (offset - stops[stops.length - 1] > 1) stops.push(offset);
        }
        if (maximum - stops[stops.length - 1] > 1) stops.push(maximum);
      }
      const active = stops.reduce(
        (nearest, offset, index) =>
          Math.abs(offset - position) < Math.abs(stops[nearest] - position) ? index : nearest,
        0,
      );
      const next = { stops, active };
      setNavigation((current) =>
        current.active === active &&
        current.stops.length === stops.length &&
        current.stops.every((offset, index) => offset === stops[index])
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

  function goTo(index: number) {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({
      left: navigation.stops[index],
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
      {navigation.stops.length > 1 && (
        <div className={s.pressDots} role="group" aria-label="Press logo navigation">
          {navigation.stops.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Go to press slide ${index + 1}`}
              aria-controls={trackId}
              aria-pressed={navigation.active === index}
              onClick={() => goTo(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
