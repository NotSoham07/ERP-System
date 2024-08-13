import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { useAuth } from './AuthContext';
import { TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';

function HR() {
  const { roles } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [salary, setSalary] = useState('');
  const [department, setDepartment] = useState('');
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEmployees();

    const subscription = supabase
      .channel('public:Employees')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'Employees' }, (payload) => {
        console.log('Change received!', payload);
        fetchEmployees();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const fetchEmployees = async () => {
    const { data, error } = await supabase.from('Employees').select('*');
    if (error) {
      setError('Error fetching employees');
      console.error(error.message);
    } else {
      setEmployees(data || []);
    }
  };

  const validateForm = () => {
    if (!name || !position || !salary || !department) {
      setError('All fields are required');
      return false;
    }
    setError(null);
    return true;
  };

  const addEmployee = async () => {
    if (!validateForm()) return;

    const { data, error } = await supabase.from('Employees').insert([
      { name, position, salary, department }
    ]);

    if (error) {
      setError('Error adding employee');
      console.error(error.message);
      return;
    }

    if (data && data.length > 0) {
      setEmployees([...employees, data[0]]);
    } else {
      setError('No data returned from the server');
    }
    resetForm();
  };

  const updateEmployee = async () => {
    if (!validateForm()) return;

    const { data, error } = await supabase.from('Employees').update({
      name, position, salary, department
    }).eq('id', editingEmployee.id);

    if (error) {
      setError('Error updating employee');
      console.error(error.message);
      return;
    }

    if (data && data.length > 0) {
      setEmployees(employees.map(emp => (emp.id === editingEmployee.id ? data[0] : emp)));
    } else {
      setError('No data returned from the server');
    }
    resetForm();
  };

  const deleteEmployee = async (id) => {
    const { error } = await supabase.from('Employees').delete().eq('id', id);
    if (error) {
      setError('Error deleting employee');
      console.error(error.message);
    } else {
      setEmployees(employees.filter(emp => emp.id !== id));
    }
  };

  const resetForm = () => {
    setName('');
    setPosition('');
    setSalary('');
    setDepartment('');
    setEditingEmployee(null);
    setError(null);
  };

  return (
    <div className="content">
      <Typography variant="h4" gutterBottom>HR Module</Typography>
      {error && <Typography color="error" gutterBottom>{error}</Typography>}
      {(roles.includes('admin') || roles.includes('manager')) ? (
        <>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Position"
            variant="outlined"
            fullWidth
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Salary"
            variant="outlined"
            fullWidth
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            margin="normal"
            type="number"
          />
          <TextField
            label="Department"
            variant="outlined"
            fullWidth
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={editingEmployee ? updateEmployee : addEmployee}
            sx={{ mt: 2 }}
          >
            {editingEmployee ? 'Update Employee' : 'Add Employee'}
          </Button>
        </>
      ) : (
        <Typography>You do not have permission to add or edit employees.</Typography>
      )}
      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="body1" fontWeight="bold">
                  Name
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" fontWeight="bold">
                  Position
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" fontWeight="bold">
                  Salary
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" fontWeight="bold">
                  Department
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" fontWeight="bold">
                  Actions
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map(employee => (
              <TableRow key={employee.id}>
                <TableCell>{employee.name}</TableCell>
                <TableCell>{employee.position}</TableCell>
                <TableCell>{employee.salary}</TableCell>
                <TableCell>{employee.department}</TableCell>
                <TableCell>
                  {(roles.includes('admin') || roles.includes('manager')) ? (
                    <>
                      <Button
                        variant="outlined"
                        color="success"
                        onClick={() => {
                          setName(employee.name);
                          setPosition(employee.position);
                          setSalary(employee.salary);
                          setDepartment(employee.department);
                          setEditingEmployee(employee);
                        }}
                        sx={{ mr: 1 }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => deleteEmployee(employee.id)}
                      >
                        Delete
                      </Button>
                    </>
                  ) : (
                    <Typography>No actions available</Typography>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default HR;
