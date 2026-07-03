import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ProductionEntry from './components/ProductionEntry';
import ProcessTracking from './components/ProcessTracking';
import QualityControl from './components/QualityControl';
import Reports from './components/Reports';
import SearchProduct from './components/SearchProduct';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route element={<PrivateRoute allowedRoles={['admin', 'supervisor', 'worker', 'qc']} />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/production" element={<ProductionEntry />} />
            <Route path="/tracking" element={<ProcessTracking />} />
            <Route path="/quality" element={<QualityControl />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/search" element={<SearchProduct />} />
          </Route>
        </Route>
        
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;