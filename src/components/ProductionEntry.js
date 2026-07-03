import React, { useState, useEffect } from 'react';
import api from '../api';

const ProductionEntry = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    product_id: '', batch_number: '', size: '', material_type: ''
  });
  const [msg, setMsg] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    api.get('/products').then(res => setProducts(res.data)).catch(console.error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      await api.post('/products', form);
      setMsg('✅ Product created successfully!');
      setForm({ product_id: '', batch_number: '', size: '', material_type: '' });
      loadProducts();
    } catch (err) {
      setMsg('❌ Error creating product');
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending: { bg: '#fff3e0', color: '#e65100' },
      in_progress: { bg: '#e3f2fd', color: '#1565c0' },
      completed: { bg: '#e8f5e9', color: '#2e7d32' },
      rejected: { bg: '#ffebee', color: '#c62828' },
      rework: { bg: '#f3e5f5', color: '#7b1fa2' },
    };
    const c = colors[status] || colors.pending;
    return { padding: '4px 10px', borderRadius: 3, fontSize: 12, backgroundColor: c.bg, color: c.color };
  };

  return (
    <div>
      {/* Create Product Form */}
      <div style={{ backgroundColor: '#fff', padding: 25, borderRadius: 10, marginBottom: 20, boxShadow: '0 1px 5px rgba(0,0,0,0.1)' }}>
        <h3 style={{ marginBottom: 15 }}>📝 Create New Product</h3>
        {msg && <p style={{ marginBottom: 10, color: msg.includes('Error') ? 'red' : 'green' }}>{msg}</p>}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <input
              placeholder="Product ID (e.g. WB-2026-006)"
              value={form.product_id}
              onChange={e => setForm({ ...form, product_id: e.target.value })}
              required
              style={{ padding: 10, border: '1px solid #ddd', borderRadius: 5 }}
            />
            <input
              placeholder="Batch Number"
              value={form.batch_number}
              onChange={e => setForm({ ...form, batch_number: e.target.value })}
              required
              style={{ padding: 10, border: '1px solid #ddd', borderRadius: 5 }}
            />
            <input
              placeholder="Size (e.g. 4x6)"
              value={form.size}
              onChange={e => setForm({ ...form, size: e.target.value })}
              required
              style={{ padding: 10, border: '1px solid #ddd', borderRadius: 5 }}
            />
            <input
              placeholder="Material Type"
              value={form.material_type}
              onChange={e => setForm({ ...form, material_type: e.target.value })}
              required
              style={{ padding: 10, border: '1px solid #ddd', borderRadius: 5 }}
            />
          </div>
          <button type="submit" style={{
            width: '100%', padding: 12, marginTop: 15,
            backgroundColor: '#1a237e', color: '#fff', border: 'none',
            borderRadius: 5, cursor: 'pointer', fontSize: 15
          }}>
            Create Product
          </button>
        </form>
      </div>

      {/* Products Table */}
      <div style={{ backgroundColor: '#fff', padding: 25, borderRadius: 10, boxShadow: '0 1px 5px rgba(0,0,0,0.1)' }}>
        <h3 style={{ marginBottom: 15 }}>📋 All Products ({products.length})</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ padding: '12px 15px', textAlign: 'left' }}>Product ID</th>
              <th style={{ padding: '12px 15px', textAlign: 'left' }}>Batch</th>
              <th style={{ padding: '12px 15px', textAlign: 'left' }}>Size</th>
              <th style={{ padding: '12px 15px', textAlign: 'left' }}>Material</th>
              <th style={{ padding: '12px 15px', textAlign: 'left' }}>Status</th>
              <th style={{ padding: '12px 15px', textAlign: 'left' }}>Stage</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px 15px', fontWeight: 500 }}>{p.product_id}</td>
                <td style={{ padding: '12px 15px' }}>{p.batch_number}</td>
                <td style={{ padding: '12px 15px' }}>{p.size}</td>
                <td style={{ padding: '12px 15px' }}>{p.material_type}</td>
                <td style={{ padding: '12px 15px' }}>
                  <span style={getStatusBadge(p.status)}>{p.status}</span>
                </td>
                <td style={{ padding: '12px 15px' }}>{p.current_stage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductionEntry;