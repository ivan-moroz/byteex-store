import { MOBILE_MEDIA_QUERY } from '@/config/breakpoints';
import Link from 'next/link';
import type { Media, Quote, Storefront } from '@/lib/content-schema';
import { MediaImage } from './MediaImage';
import headerStyles from './styles/Header.module.scss';
import ratingStyles from './styles/Rating.module.scss';
import callToActionStyles from './styles/CallToAction.module.scss';
import photoCollageStyles from './styles/PhotoCollage.module.scss';
import reviewCardStyles from './styles/ReviewCard.module.scss';
import s from './Storefront.module.scss';
export function Header({ content, catalog = false }: { content: Storefront; catalog?: boolean }) {
  return (
    <>
      <div className={headerStyles.announcement}>
        <span>{content.announcement}</span>
        <span>{content.mobileAnnouncement}</span>
      </div>
      <header className={`${s.container} ${headerStyles.header}`}>
        <Link
          href="/products"
          className={headerStyles.logo}
          aria-label={`${content.brandName} — ${content.catalogLinkLabel}`}
        >
          {content.brandName}
          <span aria-hidden="true">▪</span>
        </Link>
        {catalog && (
          <a href="#collection" className={headerStyles.catalogLink}>
            {content.catalogLinkLabel} <span aria-hidden="true">↗</span>
          </a>
        )}
      </header>
    </>
  );
}
export function Rating({ label, rating = 5 }: { label: string; rating?: number }) {
  return (
    <div className={ratingStyles.rating}>
      <span className={ratingStyles.stars} aria-label={`${rating} out of 5 stars`}>
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
    <div className={callToActionStyles.ctaGroup}>
      <Link href={content.ctaHref} className={callToActionStyles.button}>
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
    <div
      className={`${photoCollageStyles.collage} ${photoCollageStyles[variant + 'Collage'] ?? s[variant + 'Collage']}`}
    >
      {images.slice(0, 3).map((media, i) => (
        <MediaImage
          key={`${media.url}-${i}`}
          media={media}
          priority={priority}
          sizes={`${MOBILE_MEDIA_QUERY} 35vw, 25vw`}
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
    <figure
      className={`${reviewCardStyles.reviewCard} ${compact ? reviewCardStyles.compactReview : ''}`}
    >
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
