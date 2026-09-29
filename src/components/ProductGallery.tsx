'use client';
import { useState } from 'react';
import type { Media } from '@/lib/content-schema';
import { MediaImage } from './MediaImage';
import s from './Storefront.module.scss';
export function ProductGallery({ images, caption }: { images: Media[]; caption: string }) {
  const [selected, setSelected] = useState(0);
  const move = (offset: number) =>
    setSelected((current) => (current + offset + images.length) % images.length);
  return (
    <div
      className={s.gallery}
      role="region"
      aria-label={caption}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') move(1);
        if (e.key === 'ArrowLeft') move(-1);
      }}
    >
      <div className={s.galleryMain}>
        <button
          type="button"
          className={s.previous}
          aria-label="Previous image"
          onClick={() => move(-1)}
        >
          ‹
        </button>
        <MediaImage media={images[selected]} />
        <button type="button" className={s.next} aria-label="Next image" onClick={() => move(1)}>
          ›
        </button>
        <div className={s.thumbnails}>
          {images.map((image, i) => (
            <button
              type="button"
              key={`${image.url}-${i}`}
              onClick={() => setSelected(i)}
              aria-label={`View image ${i + 1}`}
              aria-pressed={selected === i}
            >
              <MediaImage media={image} sizes="60px" />
            </button>
          ))}
        </div>
      </div>
      <p aria-live="polite">{caption}</p>
    </div>
  );
}
