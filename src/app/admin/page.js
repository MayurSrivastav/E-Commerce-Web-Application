'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';

export default function Admin() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  if (authLoading || !user || user.role !== 'admin') return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name, 
          description, 
          price: parseFloat(price), 
          imageUrl 
        }),
      });

      if (res.ok) {
        setMessage('Product added successfully!');
        setName('');
        setDescription('');
        setPrice('');
        setImageUrl('');
      } else {
        const data = await res.json();
        setMessage(`Error: ${data.error}`);
      }
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  };

  return (
    <div className="auth-container glass animate-fade" style={{ maxWidth: '600px' }}>
      <h2 className="auth-title">Admin Dashboard</h2>
      <p style={{ textAlign: 'center', marginBottom: '2rem' }}>Add a new product to the catalog.</p>
      
      {message && <div style={{ textAlign: 'center', marginBottom: '1rem', color: message.includes('Error') ? '#ef4444' : '#22c55e' }}>{message}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Product Name</label>
          <input type="text" className="form-input" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea className="form-input" value={description} onChange={e => setDescription(e.target.value)} required rows={3} />
        </div>
        <div className="form-group">
          <label className="form-label">Price ($)</label>
          <input type="number" step="0.01" className="form-input" value={price} onChange={e => setPrice(e.target.value)} required />
        </div>
        <div className="form-group">
          <label className="form-label">Image URL (Optional)</label>
          <input type="url" className="form-input" value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
        </div>
        
        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Add Product</button>
      </form>
    </div>
  );
}
