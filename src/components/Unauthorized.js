import React from 'react';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', marginTop: 100 }}>
      <h1>403 - Unauthorized</h1>
      <p>You don't have permission to access this page.</p>
      <button onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
    </div>
  );
};

export default Unauthorized;