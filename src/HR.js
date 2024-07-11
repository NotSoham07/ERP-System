import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

function HR() {
  const [employees, setEmployees] = useState([]);
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [salary, setSalary] = useState('');
  const [department, setDepartment] = useState('');
  const [editingEmployee, setEditingEmployee] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    const { data, error } = await supabase.from('Employees').select('*');
    if (error) {
      console.error('Error fetching employees:', error.message);
    } else {
      setEmployees(data || []);
    }
  };

  const addEmployee = async () => {
    console.log('Adding employee:', { name, position, salary, department });
    const { data, error } = await supabase.from('Employees').insert([
      { name, position, salary, department }
    ]);

    if (error) {
      console.error('Error adding employee:', error.message);
      return;
    }

    console.log('Response from Supabase:', data);
    
    if (data && data.length > 0) {
      console.log('Employee added:', data[0]);
      setEmployees([...employees, data[0]]);
      resetForm();
    } else {
      console.error('No data returned from insert operation');
    }
  };

  const updateEmployee = async () => {
    const { data, error } = await supabase.from('Employees').update({
      name, position, salary, department
    }).eq('id', editingEmployee.id);
    
    if (error) {
      console.error('Error updating employee:', error.message);
      return;
    }

    if (data && data.length > 0) {
      setEmployees(employees.map(emp => (emp.id === editingEmployee.id ? data[0] : emp)));
      resetForm();
    } else {
      console.error('No data returned from update operation');
    }
  };

  const deleteEmployee = async (id) => {
    const { error } = await supabase.from('Employees').delete().eq('id', id);
    if (error) {
      console.error('Error deleting employee:', error.message);
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
  };

  return (
    <div>
      <h2>HR Module</h2>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Position"
        value={position}
        onChange={(e) => setPosition(e.target.value)}
      />
      <input
        type="text"
        placeholder="Salary"
        value={salary}
        onChange={(e) => setSalary(e.target.value)}
      />
      <input
        type="text"
        placeholder="Department"
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
      />
      <button onClick={editingEmployee ? updateEmployee : addEmployee}>
        {editingEmployee ? 'Update Employee' : 'Add Employee'}
      </button>
      <ul>
        {employees.map(employee => (
          <li key={employee.id}>
            {employee.name}
            <button onClick={() => {
              setName(employee.name);
              setPosition(employee.position);
              setSalary(employee.salary);
              setDepartment(employee.department);
              setEditingEmployee(employee);
            }}>Edit</button>
            <button onClick={() => deleteEmployee(employee.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HR;
