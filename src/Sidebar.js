import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';  // Import useAuth to access user roles
import './App.css';

const Sidebar = () => {
  const { roles } = useAuth();  // Get the user's roles from the AuthContext

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
        <li className="mb-4">
          <Link to="/projects" className="text-gray-300 hover:text-white">Projects Module</Link>
        </li>
        {/* Admin-specific link */}
        {roles.includes('admin') && (
          <li className="mb-4">
            <Link to="/admin/roles" className="text-gray-300 hover:text-white">Manage User Roles</Link>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
