'use client';
import { useCart } from '@/components/providers/CartProvider';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, total } = useCart();
  const router = useRouter();

  if (cart.length === 0) {
    return (
      <div className="animate-fade" style={{ textAlign: 'center', marginTop: '4rem' }}>
        <h2>Your cart is empty</h2>
        <Link href="/" className="btn btn-primary" style={{ marginTop: '2rem' }}>Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="animate-fade">
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Your Cart</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {cart.map(item => (
          <div key={item.product._id} className="cart-item glass">
            <img 
              src={item.product.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop'} 
              alt={item.product.name} 
              className="cart-item-image" 
            />
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1.25rem' }}>{item.product.name}</h3>
              <p style={{ color: 'var(--primary)', fontWeight: 'bold' }}>${item.product.price.toFixed(2)}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button 
                onClick={() => updateQuantity(item.product._id, Math.max(1, item.quantity - 1))}
                className="btn btn-secondary"
                style={{ padding: '0.25rem 0.75rem' }}
              >-</button>
              <span>{item.quantity}</span>
              <button 
                onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                className="btn btn-secondary"
                style={{ padding: '0.25rem 0.75rem' }}
              >+</button>
            </div>
            <button 
              onClick={() => removeFromCart(item.product._id)}
              className="btn"
              style={{ background: '#ef4444', color: 'white' }}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      
      <div className="cart-summary glass">
        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Total: ${total.toFixed(2)}</h3>
        <button 
          className="btn btn-primary" 
          onClick={() => router.push('/checkout')}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
