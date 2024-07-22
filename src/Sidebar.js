import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './App.css';

const Sidebar = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="sidebar">
      <h2>Dashboard</h2>
      <ul>
        <li><Link to="/dashboard">Home</Link></li>
        <li><Link to="/hr">HR Module</Link></li>
        <li><Link to="/finance">Finance Module</Link></li>
        <li><Link to="/inventory">Inventory Module</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
