'use client';
import { useState } from 'react';
import Link from 'next/link';
import type { Product, Storefront } from '@/lib/content-schema';
import { MediaImage } from './MediaImage';
import s from './Storefront.module.scss';
export function ProductCatalog({
  products,
  content,
}: {
  products: Product[];
  content: Storefront;
}) {
  const [category, setCategory] = useState<string | null>(null);
  const categories = Array.from(new Set(products.map((p) => p.category)));
  const filtered = products.filter((p) => category === null || p.category === category);
  return (
    <section id="collection" className={`${s.container} ${s.catalog}`}>
      <div className={s.filters} role="group" aria-label="Product categories">
        <button type="button" aria-pressed={category === null} onClick={() => setCategory(null)}>
          {content.allCategoryLabel}
        </button>
        {categories.map((item) => (
          <button
            type="button"
            key={item}
            aria-pressed={category === item}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>
      <div className={s.productGrid}>
        {filtered.map((product, i) => (
          <article className={s.productCard} key={product.slug}>
            <Link href={`/products/${product.slug}`}>
              <div className={s.productImage}>
                <MediaImage
                  media={product.gallery[0]}
                  priority={i < 3}
                  sizes="(max-width:700px) 90vw, (max-width:1000px) 45vw, 30vw"
                />
                <span>
                  {content.viewProductLabel} <span aria-hidden="true">⟶</span>
                </span>
              </div>
              <div className={s.productMeta}>
                <p>{product.category}</p>
                <h2>{product.title}</h2>
                <p>{product.description}</p>
              </div>
            </Link>
          </article>
        ))}
      </div>
      {filtered.length === 0 && <p role="status">{content.emptyCatalogMessage}</p>}
    </section>
  );
}
