import React, { useState, useEffect } from 'react';
import api from '../api';

const QualityControl = () => {
  const [products, setProducts] = useState([]);
  const [stages, setStages] = useState([]);
  const [form, setForm] = useState({
    product_id: '', stage_id: '', diagonal_accuracy: '',
    angle_90_ok: true, weld_quality: 'good', grinding_finish: 'smooth',
    profile_fitting: 'perfect', result: 'pass', remarks: ''
  });
  const [msg, setMsg] = useState('');
  const [checks, setChecks] = useState([]);

  useEffect(() => {
    api.get('/products').then(res => setProducts(res.data));
    api.get('/stages').then(res => setStages(res.data));
    api.get('/dashboard').then(res => {
      // Get recent QC checks from products that have them
      api.get('/products').then(prodRes => {
        const checked = prodRes.data.filter(p =>
          p.status === 'completed' || p.status === 'rejected' || p.status === 'rework'
        ).slice(0, 10);
        setChecks(checked);
      });
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      await api.post('/quality-checks', {
        ...form,
        product_id: parseInt(form.product_id),
        stage_id: parseInt(form.stage_id),
        diagonal_accuracy: parseFloat(form.diagonal_accuracy) || null,
        angle_90_ok: form.angle_90_ok === 'true' || form.angle_90_ok === true,
      });
      setMsg('✅ QC recorded successfully!');
      setForm({
        product_id: '', stage_id: '', diagonal_accuracy: '',
        angle_90_ok: true, weld_quality: 'good', grinding_finish: 'smooth',
        profile_fitting: 'perfect', result: 'pass', remarks: ''
      });
      api.get('/products').then(res => setProducts(res.data));
    } catch (err) {
      setMsg('❌ Error recording QC');
    }
  };

  const getResultBadge = (result) => {
    const colors = {
      pass: { bg: '#e8f5e9', color: '#2e7d32' },
      reject: { bg: '#ffebee', color: '#c62828' },
      rework: { bg: '#f3e5f5', color: '#7b1fa2' },
    };
    const c = colors[result] || colors.pass;
    return { padding: '4px 10px', borderRadius: 3, fontSize: 12, backgroundColor: c.bg, color: c.color };
  };

  return (
    <div>
      {/* QC Form */}
      <div style={{ backgroundColor: '#fff', padding: 25, borderRadius: 10, marginBottom: 20, boxShadow: '0 1px 5px rgba(0,0,0,0.1)' }}>
        <h3 style={{ marginBottom: 15 }}>🔍 Quality Control Check</h3>
        {msg && <p style={{ marginBottom: 10, color: msg.includes('Error') ? 'red' : 'green' }}>{msg}</p>}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, maxWidth: 600 }}>
            <select value={form.product_id} onChange={e => setForm({...form, product_id: e.target.value})} required style={{ padding: 10, border: '1px solid #ddd', borderRadius: 5 }}>
              <option value="">-- Select Product --</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.product_id} ({p.current_stage})</option>
              ))}
            </select>

            <select value={form.stage_id} onChange={e => setForm({...form, stage_id: e.target.value})} required style={{ padding: 10, border: '1px solid #ddd', borderRadius: 5 }}>
              <option value="">-- Select Stage --</option>
              {stages.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>

            <input placeholder="Diagonal Accuracy (%)" type="number" step="0.1" value={form.diagonal_accuracy} onChange={e => setForm({...form, diagonal_accuracy: e.target.value})} style={{ padding: 10, border: '1px solid #ddd', borderRadius: 5 }} />

            <select value={form.angle_90_ok} onChange={e => setForm({...form, angle_90_ok: e.target.value})} style={{ padding: 10, border: '1px solid #ddd', borderRadius: 5 }}>
              <option value="true">90° Angle: OK</option>
              <option value="false">90° Angle: FAIL</option>
            </select>

            <select value={form.weld_quality} onChange={e => setForm({...form, weld_quality: e.target.value})} style={{ padding: 10, border: '1px solid #ddd', borderRadius: 5 }}>
              <option value="good">Weld: Good</option>
              <option value="fair">Weld: Fair</option>
              <option value="poor">Weld: Poor</option>
            </select>

            <select value={form.grinding_finish} onChange={e => setForm({...form, grinding_finish: e.target.value})} style={{ padding: 10, border: '1px solid #ddd', borderRadius: 5 }}>
              <option value="smooth">Grinding: Smooth</option>
              <option value="needs work">Grinding: Needs Work</option>
              <option value="rough">Grinding: Rough</option>
            </select>

            <select value={form.profile_fitting} onChange={e => setForm({...form, profile_fitting: e.target.value})} style={{ padding: 10, border: '1px solid #ddd', borderRadius: 5 }}>
              <option value="perfect">Profile: Perfect</option>
              <option value="acceptable">Profile: Acceptable</option>
              <option value="misaligned">Profile: Misaligned</option>
            </select>

            <select value={form.result} onChange={e => setForm({...form, result: e.target.value})} required style={{ padding: 10, border: '1px solid #ddd', borderRadius: 5, fontWeight: 'bold' }}>
              <option value="pass">✅ PASS</option>
              <option value="rework">⚠️ REWORK</option>
              <option value="reject">❌ REJECT</option>
            </select>
          </div>

          <textarea placeholder="Remarks" value={form.remarks} onChange={e => setForm({...form, remarks: e.target.value})} rows={2} style={{ width: '100%', maxWidth: 600, padding: 10, marginTop: 10, border: '1px solid #ddd', borderRadius: 5, resize: 'vertical' }} />

          <button type="submit" style={{
            padding: 12, marginTop: 15, backgroundColor: '#f57c00',
            color: '#fff', border: 'none', borderRadius: 5, cursor: 'pointer', fontSize: 15
          }}>
            Submit QC Check
          </button>
        </form>
      </div>

      {/* Products with recent QC */}
      <div style={{ backgroundColor: '#fff', padding: 25, borderRadius: 10, boxShadow: '0 1px 5px rgba(0,0,0,0.1)' }}>
        <h3 style={{ marginBottom: 15 }}>📋 Products with QC Results</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ padding: '12px 15px', textAlign: 'left' }}>Product ID</th>
              <th style={{ padding: '12px 15px', textAlign: 'left' }}>Status</th>
              <th style={{ padding: '12px 15px', textAlign: 'left' }}>Stage</th>
              <th style={{ padding: '12px 15px', textAlign: 'left' }}>Batch</th>
            </tr>
          </thead>
          <tbody>
            {checks.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px 15px' }}>{p.product_id}</td>
                <td style={{ padding: '12px 15px' }}>
                  <span style={getResultBadge(p.status)}>{p.status}</span>
                </td>
                <td style={{ padding: '12px 15px' }}>{p.current_stage}</td>
                <td style={{ padding: '12px 15px' }}>{p.batch_number}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QualityControl;