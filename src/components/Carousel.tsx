'use client';
import { useRef, useState, type ReactNode } from 'react';
import s from './Storefront.module.scss';
export function Carousel({
  children,
  label,
  kind = 'reviews',
}: {
  children: ReactNode[];
  label: string;
  kind?: 'reviews' | 'steps';
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  function go(index: number) {
    const track = ref.current;
    if (!track) return;
    const target = (index + children.length) % children.length;
    const child = track.children[target] as HTMLElement;
    track.scrollTo({ left: child.offsetLeft - track.offsetLeft, behavior: 'smooth' });
    setActive(target);
  }
  return (
    <div
      className={`${s.carousel} ${kind === 'steps' ? s.stepCarousel : ''}`}
      role="region"
      aria-label={label}
    >
      <button
        type="button"
        className={s.previous}
        aria-label="Previous slide"
        onClick={() => go(active - 1)}
      >
        ‹
      </button>
      <div
        className={s.carouselTrack}
        ref={ref}
        onScroll={() => {
          const track = ref.current;
          if (!track?.children.length) return;
          const width = (track.children[0] as HTMLElement).offsetWidth + 24;
          setActive(Math.round(track.scrollLeft / width));
        }}
      >
        {children.map((child, i) => (
          <div className={s.slide} key={i}>
            {child}
          </div>
        ))}
      </div>
      <button
        type="button"
        className={s.next}
        aria-label="Next slide"
        onClick={() => go(active + 1)}
      >
        ›
      </button>
      <div className={s.dots}>
        {children.map((_, i) => (
          <button
            type="button"
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            aria-pressed={active === i}
            onClick={() => go(i)}
          />
        ))}
      </div>
    </div>
  );
}
