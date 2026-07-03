import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem('role');
  const fullName = localStorage.getItem('full_name');

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', roles: ['admin', 'supervisor', 'worker', 'qc'] },
    { path: '/production', label: 'Production', roles: ['admin', 'supervisor'] },
    { path: '/tracking', label: 'Tracking', roles: ['admin', 'supervisor', 'worker'] },
    { path: '/quality', label: 'QC', roles: ['admin', 'qc'] },
    { path: '/reports', label: 'Reports', roles: ['admin', 'supervisor'] },
    { path: '/search', label: 'Search', roles: ['admin', 'supervisor', 'qc'] },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <div style={{ width: 220, backgroundColor: '#1a237e', color: '#fff', padding: 20 }}>
        <h3 style={{ marginBottom: 30, fontSize: 20 }}>🏭 Volantis</h3>
        {navItems.filter(item => item.roles.includes(role)).map(item => (
          <div
            key={item.path}
            onClick={() => navigate(item.path)}
            style={{
              padding: '12px 15px', margin: '5px 0', cursor: 'pointer',
              borderRadius: 5, fontSize: 14,
              backgroundColor: location.pathname === item.path ? '#3949ab' : 'transparent',
              transition: '0.2s'
            }}
          >
            {item.label}
          </div>
        ))}
        <div
          onClick={handleLogout}
          style={{
            padding: '12px 15px', marginTop: 40, cursor: 'pointer',
            color: '#ef5350', fontSize: 14
          }}
        >
          🚪 Logout
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: 25, backgroundColor: '#f5f5f5' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', marginBottom: 20,
          padding: '10px 0', borderBottom: '1px solid #ddd'
        }}>
          <span style={{ color: '#666' }}>
            👤 {fullName} | <strong>{role}</strong>
          </span>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;