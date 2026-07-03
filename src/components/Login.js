import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/login', { username, password });
      localStorage.setItem('token', res.data.access_token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('full_name', res.data.full_name);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div style={{
      maxWidth: 400, margin: '100px auto', padding: 30,
      background: '#fff', borderRadius: 10,
      boxShadow: '0 2px 15px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ textAlign: 'center', color: '#1a237e' }}>Volantis Manufacturing</h2>
      <h3 style={{ textAlign: 'center', color: '#666' }}>Login</h3>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text" placeholder="Username" value={username}
          onChange={e => setUsername(e.target.value)} required
          style={{ width: '100%', padding: 10, margin: '10px 0', border: '1px solid #ddd', borderRadius: 5 }}
        />
        <input
          type="password" placeholder="Password" value={password}
          onChange={e => setPassword(e.target.value)} required
          style={{ width: '100%', padding: 10, margin: '10px 0', border: '1px solid #ddd', borderRadius: 5 }}
        />
        <button type="submit" style={{
          width: '100%', padding: 12, backgroundColor: '#1a237e',
          color: '#fff', border: 'none', borderRadius: 5, cursor: 'pointer',
          fontSize: 16, marginTop: 10
        }}>
          Login
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: 15, fontSize: 12, color: '#999' }}>
        Demo: admin/admin123 | worker/test123
      </p>
    </div>
  );
};

export default Login;