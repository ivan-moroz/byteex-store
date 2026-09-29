import Link from 'next/link';
import type { Media, Quote, Storefront } from '@/lib/content-schema';
import { MediaImage } from './MediaImage';
import s from './Storefront.module.scss';
export function Header({ content, catalog = false }: { content: Storefront; catalog?: boolean }) {
  return (
    <>
      <div className={s.announcement}>
        <span>{content.announcement}</span>
        <span>{content.mobileAnnouncement}</span>
      </div>
      <header className={`${s.container} ${s.header}`}>
        <Link
          href="/products"
          className={s.logo}
          aria-label={`${content.brandName} — ${content.catalogLinkLabel}`}
        >
          {content.brandName}
          <span aria-hidden="true">▪</span>
        </Link>
        {catalog && (
          <a href="#collection" className={s.catalogLink}>
            {content.catalogLinkLabel} <span aria-hidden="true">↗</span>
          </a>
        )}
      </header>
    </>
  );
}
export function Rating({ label, rating = 5 }: { label: string; rating?: number }) {
  return (
    <div className={s.rating}>
      <span className={s.stars} aria-label={`${rating} out of 5 stars`}>
        {'★'.repeat(Math.round(rating))}
      </span>
      <span>{label}</span>
    </div>
  );
}
export function CallToAction({
  content,
  review = true,
}: {
  content: Storefront;
  review?: boolean;
}) {
  return (
    <div className={s.ctaGroup}>
      <Link href={content.ctaHref} className={s.button}>
        {content.ctaLabel}
        <span aria-hidden="true">⟶</span>
      </Link>
      {review && <Rating label={content.reviewLabel} />}
    </div>
  );
}
export function PhotoCollage({
  images,
  variant = 'hero',
  priority = false,
}: {
  images: Media[];
  variant?: 'hero' | 'story' | 'faq' | 'final';
  priority?: boolean;
}) {
  return (
    <div className={`${s.collage} ${s[variant + 'Collage']}`}>
      {images.slice(0, 3).map((media, i) => (
        <MediaImage
          key={`${media.url}-${i}`}
          media={media}
          priority={priority}
          sizes="(max-width: 700px) 35vw, 25vw"
        />
      ))}
    </div>
  );
}
export function ReviewCard({
  quote,
  compact = false,
  label,
}: {
  quote: Quote;
  compact?: boolean;
  label?: string;
}) {
  return (
    <figure className={`${s.reviewCard} ${compact ? s.compactReview : ''}`}>
      <figcaption>
        <MediaImage media={quote.avatar} sizes="40px" />
        <div>
          <Rating label={label || ''} rating={quote.rating} />
          <span>{quote.name}</span>
        </div>
      </figcaption>
      <blockquote>{quote.text}</blockquote>
    </figure>
  );
}
