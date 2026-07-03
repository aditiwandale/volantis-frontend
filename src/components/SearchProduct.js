import React, { useState } from 'react';
import api from '../api';

const SearchProduct = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    try {
      const res = await api.get(`/search?q=${query}`);
      setResults(res.data);
      setSearched(true);
      setSelectedProduct(null);
    } catch (err) {
      console.error(err);
    }
  };

  const viewProduct = async (id) => {
    try {
      const res = await api.get(`/products/${id}`);
      setSelectedProduct(res.data);
    } catch (err) {
      console.error(err);
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
      {/* Search Bar */}
      <div style={{ backgroundColor: '#fff', padding: 25, borderRadius: 10, marginBottom: 20, boxShadow: '0 1px 5px rgba(0,0,0,0.1)' }}>
        <h3 style={{ marginBottom: 15 }}>🔍 Search Products</h3>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 10 }}>
          <input
            type="text"
            placeholder="Search by Product ID or Batch Number..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{ flex: 1, padding: 12, border: '1px solid #ddd', borderRadius: 5, fontSize: 15 }}
          />
          <button type="submit" style={{
            padding: '12px 30px', backgroundColor: '#1a237e', color: '#fff',
            border: 'none', borderRadius: 5, cursor: 'pointer', fontSize: 15
          }}>
            Search
          </button>
        </form>
      </div>

      {/* Search Results */}
      {searched && results.length === 0 && (
        <div style={{ backgroundColor: '#fff', padding: 25, borderRadius: 10, textAlign: 'center', color: '#999' }}>
          No products found for "{query}"
        </div>
      )}

      {results.length > 0 && (
        <div style={{ backgroundColor: '#fff', padding: 25, borderRadius: 10, marginBottom: 20, boxShadow: '0 1px 5px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginBottom: 15 }}>Results ({results.length})</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5' }}>
                <th style={{ padding: '12px 15px', textAlign: 'left' }}>Product ID</th>
                <th style={{ padding: '12px 15px', textAlign: 'left' }}>Batch</th>
                <th style={{ padding: '12px 15px', textAlign: 'left' }}>Status</th>
                <th style={{ padding: '12px 15px', textAlign: 'left' }}>Stage</th>
                <th style={{ padding: '12px 15px', textAlign: 'left' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {results.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px 15px', fontWeight: 500 }}>{p.product_id}</td>
                  <td style={{ padding: '12px 15px' }}>{p.batch_number}</td>
                  <td style={{ padding: '12px 15px' }}>
                    <span style={getStatusBadge(p.status)}>{p.status}</span>
                  </td>
                  <td style={{ padding: '12px 15px' }}>{p.current_stage}</td>
                  <td style={{ padding: '12px 15px' }}>
                    <button onClick={() => viewProduct(p.id)} style={{
                      padding: '6px 15px', backgroundColor: '#1976d2', color: '#fff',
                      border: 'none', borderRadius: 3, cursor: 'pointer'
                    }}>
                      View History
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Product Detail */}
      {selectedProduct && (
        <div style={{ backgroundColor: '#fff', padding: 25, borderRadius: 10, boxShadow: '0 1px 5px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginBottom: 15 }}>📋 Product History: {selectedProduct.product_id}</h3>
          <p><strong>Batch:</strong> {selectedProduct.batch_number} | <strong>Size:</strong> {selectedProduct.size} | <strong>Material:</strong> {selectedProduct.material_type}</p>

          <h4 style={{ marginTop: 20, marginBottom: 10 }}>Process Records</h4>
          {selectedProduct.process_records.length === 0 ? (
            <p style={{ color: '#999' }}>No process records yet</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 20 }}>
              <thead>
                <tr style={{ backgroundColor: '#f5f5f5' }}>
                  <th style={{ padding: '10px' }}>Stage</th>
                  <th style={{ padding: '10px' }}>Worker</th>
                  <th style={{ padding: '10px' }}>Time</th>
                  <th style={{ padding: '10px' }}>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {selectedProduct.process_records.map((r, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '10px' }}>{r.stage}</td>
                    <td style={{ padding: '10px' }}>{r.worker}</td>
                    <td style={{ padding: '10px', fontSize: 13 }}>{new Date(r.end_time).toLocaleString()}</td>
                    <td style={{ padding: '10px' }}>{r.remarks || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <h4 style={{ marginBottom: 10 }}>Quality Checks</h4>
          {selectedProduct.quality_checks.length === 0 ? (
            <p style={{ color: '#999' }}>No quality checks yet</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f5f5f5' }}>
                  <th style={{ padding: '10px' }}>Result</th>
                  <th style={{ padding: '10px' }}>Inspector</th>
                  <th style={{ padding: '10px' }}>Time</th>
                  <th style={{ padding: '10px' }}>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {selectedProduct.quality_checks.map((q, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '10px' }}>
                      <span style={getStatusBadge(q.result)}>{q.result}</span>
                    </td>
                    <td style={{ padding: '10px' }}>{q.inspector}</td>
                    <td style={{ padding: '10px', fontSize: 13 }}>{new Date(q.checked_at).toLocaleString()}</td>
                    <td style={{ padding: '10px' }}>{q.remarks || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchProduct;