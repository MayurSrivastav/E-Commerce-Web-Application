'use client';
import { useCart } from './providers/CartProvider';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="card glass">
      <img 
        src={product.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop'} 
        alt={product.name} 
        className="card-image" 
      />
      <div className="card-content">
        <h3 className="card-title">{product.name}</h3>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1rem', flex: 1 }}>
          {product.description}
        </p>
        <div className="card-price">${product.price.toFixed(2)}</div>
        <button 
          className="btn btn-primary" 
          style={{ width: '100%' }}
          onClick={() => addToCart(product)}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
