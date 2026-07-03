import React, { useState, useEffect } from 'react';
import api from '../api';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const Dashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/dashboard').then(res => setData(res.data)).catch(console.error);
  }, []);

  if (!data) return <p style={{ textAlign: 'center', padding: 50 }}>Loading dashboard...</p>;

  const statusData = [
    { name: 'Pending', value: data.pending },
    { name: 'In Progress', value: data.in_progress },
    { name: 'Completed', value: data.completed },
    { name: 'Rejected', value: data.rejected },
    { name: 'Rework', value: data.rework },
  ];

  const COLORS = ['#ff9800', '#2196f3', '#4caf50', '#f44336', '#9c27b0'];

  const cards = [
    { label: 'Total Products', value: data.total_products, color: '#1a237e' },
    { label: 'Pending', value: data.pending, color: '#ff9800' },
    { label: 'Completed', value: data.completed, color: '#4caf50' },
    { label: 'Rejected', value: data.rejected, color: '#f44336' },
  ];

  return (
    <div>
      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 15, marginBottom: 25 }}>
        {cards.map(card => (
          <div key={card.label} style={{
            padding: 20, backgroundColor: '#fff', borderRadius: 10,
            boxShadow: '0 1px 5px rgba(0,0,0,0.1)', textAlign: 'center'
          }}>
            <h1 style={{ color: card.color, fontSize: 36, margin: 0 }}>{card.value}</h1>
            <p style={{ color: '#666', marginTop: 5 }}>{card.label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 25 }}>
        <div style={{ backgroundColor: '#fff', padding: 20, borderRadius: 10 }}>
          <h3 style={{ marginBottom: 10 }}>Production Status</h3>
          <PieChart width={380} height={280}>
            <Pie data={statusData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label>
              {statusData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        <div style={{ backgroundColor: '#fff', padding: 20, borderRadius: 10 }}>
          <h3 style={{ marginBottom: 10 }}>Quality Control</h3>
          <BarChart width={380} height={280} data={[
            { name: 'QC Results', Passed: data.passed_qc, Failed: data.failed_qc }
          ]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Passed" fill="#4caf50" />
            <Bar dataKey="Failed" fill="#f44336" />
          </BarChart>
        </div>
      </div>

      {/* Recent Products */}
      <div style={{ backgroundColor: '#fff', padding: 20, borderRadius: 10 }}>
        <h3 style={{ marginBottom: 15 }}>Recent Products</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ padding: '10px 15px', textAlign: 'left' }}>Product ID</th>
              <th style={{ padding: '10px 15px', textAlign: 'left' }}>Status</th>
              <th style={{ padding: '10px 15px', textAlign: 'left' }}>Current Stage</th>
            </tr>
          </thead>
          <tbody>
            {data.recent_products.map((p, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px 15px' }}>{p.product_id}</td>
                <td style={{ padding: '10px 15px' }}>
                  <span style={{
                    padding: '4px 10px', borderRadius: 3, fontSize: 12,
                    backgroundColor:
                      p.status === 'completed' ? '#e8f5e9' :
                      p.status === 'rejected' ? '#ffebee' :
                      p.status === 'rework' ? '#f3e5f5' : '#fff3e0',
                    color:
                      p.status === 'completed' ? '#2e7d32' :
                      p.status === 'rejected' ? '#c62828' :
                      p.status === 'rework' ? '#7b1fa2' : '#e65100'
                  }}>
                    {p.status}
                  </span>
                </td>
                <td style={{ padding: '10px 15px' }}>{p.current_stage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;