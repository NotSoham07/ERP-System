import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from './supabaseClient';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Container } from '@mui/material';

function AdminSignup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { selectedRole } = useAuth(); // Access selectedRole from context

  const handleSignup = async () => {
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;

      // Insert user role in the database
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert([{ user_id: data.user.id, role: selectedRole }]);

      if (roleError) throw roleError;

      navigate('/dashboard');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h4" align="center" gutterBottom>
        Signup as {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}
      </Typography>
      {error && <Typography color="error" align="center" gutterBottom>{error}</Typography>}
      <TextField
        label="Email"
        variant="outlined"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        label="Password"
        type="password"
        variant="outlined"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleSignup}
        sx={{ mt: 2 }}
      >
        Signup
      </Button>
    </Container>
  );
}

export default AdminSignup;
