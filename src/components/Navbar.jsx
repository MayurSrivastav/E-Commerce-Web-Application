'use client';
import Link from 'next/link';
import { useAuth } from './providers/AuthProvider';
import { useCart } from './providers/CartProvider';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="navbar glass">
      <Link href="/" className="nav-brand">
        Aura Store
      </Link>
      <div className="nav-links">
        <Link href="/" className="nav-link">Products</Link>
        <Link href="/cart" className="nav-link">
          Cart {cartCount > 0 && <span style={{ background: 'var(--primary)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem', marginLeft: '4px' }}>{cartCount}</span>}
        </Link>
        
        {user ? (
          <>
            <Link href="/orders" className="nav-link">Orders</Link>
            {user.role === 'admin' && (
              <Link href="/admin" className="nav-link">Admin</Link>
            )}
            <button onClick={logout} className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>Logout</button>
          </>
        ) : (
          <>
            <Link href="/login" className="nav-link">Login</Link>
            <Link href="/register" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
