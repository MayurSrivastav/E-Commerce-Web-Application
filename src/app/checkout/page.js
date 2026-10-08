'use client';
import { useState } from 'react';
import { useCart } from '@/components/providers/CartProvider';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';

export default function Checkout() {
  const { cart, total, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (cart.length === 0) {
    router.push('/cart');
    return null;
  }

  if (!user) {
    return (
      <div className="animate-fade" style={{ textAlign: 'center', marginTop: '4rem' }}>
        <h2>Please log in to checkout</h2>
        <button onClick={() => router.push('/login')} className="btn btn-primary" style={{ marginTop: '1rem' }}>Log In</button>
      </div>
    );
  }

  const handleCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const orderItems = cart.map(item => ({
        product: item.product._id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity
      }));

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: orderItems, totalAmount: total }),
      });

      if (!res.ok) {
        throw new Error('Failed to place order');
      }

      clearCart();
      router.push('/orders');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container glass animate-fade" style={{ maxWidth: '600px' }}>
      <h2 className="auth-title">Checkout</h2>
      {error && <div style={{ color: '#ef4444', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Order Summary</h3>
        {cart.map(item => (
          <div key={item.product._id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span>{item.quantity} x {item.product.name}</span>
            <span>${(item.product.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', fontWeight: 'bold', fontSize: '1.2rem' }}>
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <form onSubmit={handleCheckout}>
        <div className="form-group">
          <label className="form-label">Shipping Address</label>
          <textarea 
            className="form-input" 
            value={address} 
            onChange={(e) => setAddress(e.target.value)} 
            required 
            rows={3}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
          {loading ? 'Processing...' : 'Place Order'}
        </button>
      </form>
    </div>
  );
}
