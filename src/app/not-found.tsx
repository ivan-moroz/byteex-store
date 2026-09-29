import Link from 'next/link';
export default function NotFound() {
  return (
    <main id="main" className="statusPage">
      <h1>Product not found.</h1>
      <Link href="/products">Back to the collection</Link>
    </main>
  );
}
