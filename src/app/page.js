import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import ProductCard from '@/components/ProductCard';

export default async function Home() {
  let products = [];
  let isDbConnected = true;

  try {
    await dbConnect();
    products = await Product.find().sort({ createdAt: -1 }).lean();
  } catch (error) {
    console.error("Database connection error:", error.message);
    isDbConnected = false;
    
    // Provide mock products so the user can still preview the frontend without a DB
    products = [
      {
        _id: "mock_1",
        name: "Aura Noise-Canceling Headphones",
        description: "Experience silence and premium sound quality with our flagship headphones.",
        price: 299.99,
        imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop"
      },
      {
        _id: "mock_2",
        name: "Minimalist Smartwatch",
        description: "Track your fitness and stay connected with this sleek, modern smartwatch.",
        price: 199.00,
        imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop"
      },
      {
        _id: "mock_3",
        name: "Mechanical Keyboard",
        description: "Elevate your typing experience with customizable RGB and tactile switches.",
        price: 149.50,
        imageUrl: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=600&auto=format&fit=crop"
      }
    ];
  }

  return (
    <div className="animate-fade">
      <div style={{ textAlign: 'center', marginBottom: '4rem', marginTop: '2rem' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '1rem', background: 'linear-gradient(to right, var(--primary), var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Discover the Extraordinary
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#cbd5e1', maxWidth: '600px', margin: '0 auto' }}>
          Curated products designed for modern life. Experience premium quality with our exclusive collection.
        </p>
        
        {!isDbConnected && (
          <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', borderRadius: '0.5rem', color: '#fca5a5', maxWidth: '800px', margin: '2rem auto 0' }}>
            <strong>Database Not Connected:</strong> Could not connect to local MongoDB. Showing mock data so you can preview the website's design and layout! 
          </div>
        )}
      </div>

      <div className="product-grid">
        {products.map(product => (
          <ProductCard key={product._id.toString()} product={JSON.parse(JSON.stringify(product))} />
        ))}
        {products.length === 0 && isDbConnected && (
          <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#cbd5e1' }}>No products found. Please add some via the Admin panel.</p>
        )}
      </div>
    </div>
  );
}
