import { notFound } from 'next/navigation';
import { getProduct, getStorefront } from '@/lib/strapi';
import { ProductLanding } from '@/components/ProductLanding';
export const dynamic = 'force-dynamic';
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const p = await getProduct(slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.description,
    openGraph: { title: p.title, description: p.description, images: [p.gallery[0].url] },
  };
}
export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const [product, content] = await Promise.all([getProduct(slug), getStorefront()]);
  if (!product) notFound();
  return <ProductLanding product={product} content={content} />;
}
