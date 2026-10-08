'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      fetch('/api/orders')
        .then(res => res.json())
        .then(data => {
          setOrders(data);
          setLoading(false);
        });
    }
  }, [user, authLoading, router]);

  if (loading || authLoading) return <div style={{ textAlign: 'center', marginTop: '4rem' }}>Loading...</div>;

  return (
    <div className="animate-fade">
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>{user?.role === 'admin' ? 'All Orders' : 'My Orders'}</h1>
      
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {orders.map(order => (
            <div key={order._id} className="glass" style={{ padding: '1.5rem', borderRadius: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                <div>
                  <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Order ID</div>
                  <div>{order._id}</div>
                </div>
                <div>
                  <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Date</div>
                  <div>{new Date(order.createdAt).toLocaleDateString()}</div>
                </div>
                <div>
                  <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Status</div>
                  <div style={{ color: 'var(--primary)', textTransform: 'capitalize' }}>{order.status}</div>
                </div>
                <div>
                  <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Total</div>
                  <div style={{ fontWeight: 'bold' }}>${order.totalAmount.toFixed(2)}</div>
                </div>
              </div>
              
              <div>
                <h4 style={{ marginBottom: '0.5rem' }}>Items:</h4>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {order.items.map(item => (
                    <li key={item._id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span>{item.quantity}x {item.name}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
