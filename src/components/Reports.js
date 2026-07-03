import React, { useState, useEffect } from 'react';
import api from '../api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const Reports = () => {
  const [dailyReport, setDailyReport] = useState(null);
  const [workerReport, setWorkerReport] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const daily = await api.get('/report/daily');
      setDailyReport(daily.data);
      const worker = await api.get('/report/worker');
      setWorkerReport(worker.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  if (loading) return <p style={{ textAlign: 'center', padding: 50 }}>Loading reports...</p>;

  return (
    <div>
      {/* Daily Production Report */}
      <div style={{ backgroundColor: '#fff', padding: 25, borderRadius: 10, marginBottom: 20, boxShadow: '0 1px 5px rgba(0,0,0,0.1)' }}>
        <h3 style={{ marginBottom: 15 }}>📊 Daily Production Report</h3>
        <p style={{ color: '#666', marginBottom: 15 }}>Date: <strong>{dailyReport?.date}</strong></p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 15, marginBottom: 20 }}>
          {[
            { label: 'Products Created', value: dailyReport?.products_created, color: '#1a237e' },
            { label: 'Stages Completed', value: dailyReport?.stages_completed, color: '#4caf50' },
            { label: 'QC Performed', value: dailyReport?.qc_performed, color: '#f57c00' },
          ].map(card => (
            <div key={card.label} style={{
              padding: 20, textAlign: 'center', borderRadius: 8,
              backgroundColor: '#f5f5f5'
            }}>
              <h2 style={{ color: card.color, fontSize: 32, margin: 0 }}>{card.value}</h2>
              <p style={{ color: '#666', marginTop: 5 }}>{card.label}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
          <div style={{ padding: 15, backgroundColor: '#e8f5e9', borderRadius: 8, textAlign: 'center' }}>
            <h3 style={{ color: '#2e7d32' }}>QC Passed: {dailyReport?.qc_passed}</h3>
          </div>
          <div style={{ padding: 15, backgroundColor: '#ffebee', borderRadius: 8, textAlign: 'center' }}>
            <h3 style={{ color: '#c62828' }}>QC Failed: {dailyReport?.qc_failed}</h3>
          </div>
        </div>
      </div>

      {/* Worker Productivity Report */}
      <div style={{ backgroundColor: '#fff', padding: 25, borderRadius: 10, boxShadow: '0 1px 5px rgba(0,0,0,0.1)' }}>
        <h3 style={{ marginBottom: 15 }}>👷 Worker Productivity</h3>
        <BarChart width={700} height={300} data={workerReport}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="tasks_completed" fill="#1a237e" name="Tasks Completed" />
        </BarChart>

        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 20 }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ padding: '12px 15px', textAlign: 'left' }}>Worker</th>
              <th style={{ padding: '12px 15px', textAlign: 'left' }}>Username</th>
              <th style={{ padding: '12px 15px', textAlign: 'left' }}>Tasks Completed</th>
            </tr>
          </thead>
          <tbody>
            {workerReport.map((w, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px 15px' }}>{w.name}</td>
                <td style={{ padding: '12px 15px' }}>{w.username}</td>
                <td style={{ padding: '12px 15px' }}>
                  <span style={{
                    padding: '4px 10px', borderRadius: 3,
                    backgroundColor: '#e3f2fd', color: '#1565c0', fontWeight: 'bold'
                  }}>
                    {w.tasks_completed}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;