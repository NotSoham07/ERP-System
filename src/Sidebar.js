import React from 'react';
import { Link } from 'react-router-dom';
import './index.css';

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-900 text-gray-100 h-screen p-6">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      <ul>
        <li className="mb-4">
          <Link to="/dashboard" className="text-gray-300 hover:text-white">Home</Link>
        </li>
        <li className="mb-4">
          <Link to="/hr" className="text-gray-300 hover:text-white">HR Module</Link>
        </li>
        <li className="mb-4">
          <Link to="/finance" className="text-gray-300 hover:text-white">Finance Module</Link>
        </li>
        <li className="mb-4">
          <Link to="/inventory" className="text-gray-300 hover:text-white">Inventory Module</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
