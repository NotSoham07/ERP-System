import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

const RoleSelection = ({ onSelectRole }) => {
  const [selectedRole, setSelectedRole] = useState('');
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const handleNext = () => {
    if (selectedRole) {
      onSelectRole(selectedRole);
      navigate('/admin/signup');
    } else {
      alert('Please select a role before proceeding.');
    }
  };

  return (
    <div className="content">
      <h2 className="text-2xl font-bold mb-6">Select Role for New User</h2>
      <div className="flex flex-col space-y-4 text-black">
        <button
          className={`p-2 border rounded ${selectedRole === 'manager' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
          onClick={() => handleRoleSelect('manager')}
        >
          Manager
        </button>
        <button
          className={`p-2 border rounded ${selectedRole === 'employee' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
          onClick={() => handleRoleSelect('employee')}
        >
          Employee
        </button>
        <button
          className={`p-2 border rounded ${selectedRole === 'admin' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
          onClick={() => handleRoleSelect('admin')}
        >
          Admin
        </button>
      </div>
      <button
        onClick={handleNext}
        className="mt-6 bg-blue-500 text-white p-2 rounded"
      >
        Next
      </button>
    </div>
  );
};

export default RoleSelection;
