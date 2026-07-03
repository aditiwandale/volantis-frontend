import React, { useState, useEffect } from 'react';
import api from '../api';

const ProcessTracking = () => {
  const [products, setProducts] = useState([]);
  const [stages, setStages] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedStage, setSelectedStage] = useState('');
  const [remarks, setRemarks] = useState('');
  const [msg, setMsg] = useState('');
  const [records, setRecords] = useState([]);

  useEffect(() => {
    api.get('/products').then(res => setProducts(res.data));
    api.get('/stages').then(res => setStages(res.data));
    api.get('/process-records').then(res => setRecords(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      await api.post('/process-records', {
        product_id: parseInt(selectedProduct),
        stage_id: parseInt(selectedStage),
        remarks
      });
      setMsg('✅ Stage marked as complete!');
      setRemarks('');
      setSelectedStage('');
      // Refresh data
      api.get('/products').then(res => setProducts(res.data));
      api.get('/process-records').then(res => setRecords(res.data));
    } catch (err) {
      setMsg('❌ Error updating stage');
    }
  };

  const pendingProducts = products.filter(p => p.status !== 'completed' && p.status !== 'rejected');

  return (
    <div>
      {/* Stage Completion Form */}
      <div style={{ backgroundColor: '#fff', padding: 25, borderRadius: 10, marginBottom: 20, boxShadow: '0 1px 5px rgba(0,0,0,0.1)' }}>
        <h3 style={{ marginBottom: 15 }}>🔧 Mark Stage Complete</h3>
        {msg && <p style={{ marginBottom: 10, color: msg.includes('Error') ? 'red' : 'green' }}>{msg}</p>}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gap: 10, maxWidth: 500 }}>
            <select
              value={selectedProduct}
              onChange={e => setSelectedProduct(e.target.value)}
              required
              style={{ padding: 10, border: '1px solid #ddd', borderRadius: 5 }}
            >
              <option value="">-- Select Product --</option>
              {pendingProducts.map(p => (
                <option key={p.id} value={p.id}>
                  {p.product_id} - Current: {p.current_stage}
                </option>
              ))}
            </select>

            <select
              value={selectedStage}
              onChange={e => setSelectedStage(e.target.value)}
              required
              style={{ padding: 10, border: '1px solid #ddd', borderRadius: 5 }}
            >
              <option value="">-- Select Stage --</option>
              {stages.map(s => (
                <option key={s.id} value={s.id}>
                  {s.sequence}. {s.name}
                </option>
              ))}
            </select>

            <textarea
              placeholder="Remarks (optional)"
              value={remarks}
              onChange={e => setRemarks(e.target.value)}
              rows={2}
              style={{ padding: 10, border: '1px solid #ddd', borderRadius: 5, resize: 'vertical' }}
            />

            <button type="submit" style={{
              padding: 12, backgroundColor: '#4caf50', color: '#fff',
              border: 'none', borderRadius: 5, cursor: 'pointer', fontSize: 15
            }}>
              ✅ Complete Stage
            </button>
          </div>
        </form>
      </div>

      {/* Recent Records */}
      <div style={{ backgroundColor: '#fff', padding: 25, borderRadius: 10, boxShadow: '0 1px 5px rgba(0,0,0,0.1)' }}>
        <h3 style={{ marginBottom: 15 }}>📋 Recent Process Records</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ padding: '12px 15px', textAlign: 'left' }}>Product</th>
              <th style={{ padding: '12px 15px', textAlign: 'left' }}>Stage</th>
              <th style={{ padding: '12px 15px', textAlign: 'left' }}>Worker</th>
              <th style={{ padding: '12px 15px', textAlign: 'left' }}>Time</th>
              <th style={{ padding: '12px 15px', textAlign: 'left' }}>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {records.slice(0, 15).map(r => (
              <tr key={r.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px 15px' }}>#{r.product_id}</td>
                <td style={{ padding: '12px 15px' }}>{r.stage}</td>
                <td style={{ padding: '12px 15px' }}>{r.worker}</td>
                <td style={{ padding: '12px 15px', fontSize: 13, color: '#666' }}>
                  {new Date(r.end_time).toLocaleString()}
                </td>
                <td style={{ padding: '12px 15px' }}>{r.remarks || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProcessTracking;