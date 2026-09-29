import Image from 'next/image';
import type { Media } from '@/lib/content-schema';
export function MediaImage({
  media,
  className,
  priority = false,
  sizes = '(max-width: 700px) 90vw, 40vw',
}: {
  media: Media;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <Image
      src={media.url}
      alt={media.alternativeText || ''}
      width={media.width || 800}
      height={media.height || 1100}
      className={className}
      sizes={sizes}
      priority={priority}
    />
  );
}
