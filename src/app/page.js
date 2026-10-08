import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import ProductCard from '@/components/ProductCard';

export default async function Home() {
  await dbConnect();
  // Fetch products directly from DB in Server Component
  const products = await Product.find().sort({ createdAt: -1 }).lean();

  return (
    <div className="animate-fade">
      <div style={{ textAlign: 'center', marginBottom: '4rem', marginTop: '2rem' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '1rem', background: 'linear-gradient(to right, var(--primary), var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Discover the Extraordinary
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#cbd5e1', maxWidth: '600px', margin: '0 auto' }}>
          Curated products designed for modern life. Experience premium quality with our exclusive collection.
        </p>
      </div>

      <div className="product-grid">
        {products.map(product => (
          <ProductCard key={product._id.toString()} product={JSON.parse(JSON.stringify(product))} />
        ))}
        {products.length === 0 && (
          <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#cbd5e1' }}>No products found. Please add some via the Admin panel.</p>
        )}
      </div>
    </div>
  );
}
