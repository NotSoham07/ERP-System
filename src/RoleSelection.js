import React, { useState } from 'react';
import { Button, Typography, RadioGroup, FormControlLabel, Radio, Paper, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

function RoleSelection() {
  const [selectedRole, setLocalSelectedRole] = useState('');  // Local state for role selection
  const navigate = useNavigate();
  const { setSelectedRole } = useAuth();  // Accessing setSelectedRole from context

  const handleRoleSelection = () => {
    if (selectedRole) {
      setSelectedRole(selectedRole);  // Update role in context
      navigate('/admin/signup');
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} style={{ padding: 20, marginTop: 20 }}>
        <Typography variant="h4" gutterBottom>Select Role for New User</Typography>
        <RadioGroup
          value={selectedRole}
          onChange={(e) => setLocalSelectedRole(e.target.value)}  // Update local state
        >
          <FormControlLabel value="manager" control={<Radio />} label="Manager" />
          <FormControlLabel value="employee" control={<Radio />} label="Employee" />
          <FormControlLabel value="admin" control={<Radio />} label="Admin" />
        </RadioGroup>
        <Button
          variant="contained"
          color="primary"
          onClick={handleRoleSelection}
          disabled={!selectedRole}
          sx={{ mt: 2 }}
        >
          Next
        </Button>
      </Paper>
    </Container>
  );
}

export default RoleSelection;
