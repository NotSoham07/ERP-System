import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import './App.css';

const AdminSignup = ({ selectedRole }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSignup = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage(`Error: ${error.message}`);
      return;
    }

    const userId = data.user.id;

    const { data: roleData, error: roleError } = await supabase
      .from('roles')
      .select('id')
      .eq('name', selectedRole)
      .single();

    if (roleError) {
      setMessage(`Error fetching role: ${roleError.message}`);
      return;
    }

    const { error: assignRoleError } = await supabase
      .from('user_roles')
      .insert([{ user_id: userId, role_id: roleData.id }]);

    if (assignRoleError) {
      setMessage(`Error assigning role: ${assignRoleError.message}`);
    } else {
      setMessage(`User created successfully as ${selectedRole}`);
    }
  };

  return (
    <div className="content">
      <h2 className="text-2xl font-bold mb-6">Create a New {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}</h2>
      <input
        type="email"
        className="border border-gray-300 p-2 mb-4 w-full"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        className="border border-gray-300 p-2 mb-4 w-full"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={handleSignup}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Sign Up
      </button>
      {message && <p className="mt-4 text-white">{message}</p>}
    </div>
  );
};

export default AdminSignup;
