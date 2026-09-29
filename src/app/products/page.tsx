import { getProducts, getStorefront } from '@/lib/strapi';
import { Header } from '@/components/Storefront';
import { ProductCatalog } from '@/components/ProductCatalog';
import s from '@/components/Storefront.module.scss';
export const dynamic = 'force-dynamic';
export async function generateMetadata() {
  const c = await getStorefront();
  return { title: c.catalogHeading, description: c.catalogDescription };
}
export default async function ProductsPage() {
  const [products, content] = await Promise.all([getProducts(), getStorefront()]);
  return (
    <>
      <Header content={content} catalog />
      <main id="main">
        <div className={s.catalogIntro}>
          <p>{content.brandName}</p>
          <h1>{content.catalogHeading}</h1>
          <p>{content.catalogDescription}</p>
        </div>
        <ProductCatalog products={products} content={content} />
      </main>
    </>
  );
}
