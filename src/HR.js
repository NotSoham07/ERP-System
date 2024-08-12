import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { useAuth } from './AuthContext';  // Import useAuth to access user roles
import './index.css';

function HR() {
  const { roles } = useAuth();  // Get the user's roles from the AuthContext
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
        fetchEmployees();  // Re-fetch employees whenever a change is detected
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
      <h2 className="text-2xl font-bold mb-6">HR Module</h2>
      {error && <div className="error text-red-500 mb-4">{error}</div>}
      {(roles.includes('admin') || roles.includes('manager')) ? (
        <>
          <input
            type="text"
            className="border border-gray-300 p-2 mb-4 w-full"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            className="border border-gray-300 p-2 mb-4 w-full"
            placeholder="Position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          />
          <input
            type="number"
            className="border border-gray-300 p-2 mb-4 w-full"
            placeholder="Salary"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
          />
          <input
            type="text"
            className="border border-gray-300 p-2 mb-4 w-full"
            placeholder="Department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          />
          <button onClick={editingEmployee ? updateEmployee : addEmployee} className="bg-blue-500 text-white p-2 rounded">
            {editingEmployee ? 'Update Employee' : 'Add Employee'}
          </button>
        </>
      ) : (
        <p>You do not have permission to add or edit employees.</p>
      )}
      <table className="table-auto w-full mt-6">
        <thead>
          <tr>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Position</th>
            <th className="px-4 py-2">Salary</th>
            <th className="px-4 py-2">Department</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(employee => (
            <tr key={employee.id} className="bg-gray-200">
              <td className="border px-4 py-2">{employee.name}</td>
              <td className="border px-4 py-2">{employee.position}</td>
              <td className="border px-4 py-2">{employee.salary}</td>
              <td className="border px-4 py-2">{employee.department}</td>
              <td className="border px-4 py-2">
                {(roles.includes('admin') || roles.includes('manager')) ? (
                  <>
                    <button className="bg-green-500 text-white p-1 rounded mr-2" onClick={() => {
                      setName(employee.name);
                      setPosition(employee.position);
                      setSalary(employee.salary);
                      setDepartment(employee.department);
                      setEditingEmployee(employee);
                    }}>Edit</button>
                    <button className="bg-red-500 text-white p-1 rounded" onClick={() => deleteEmployee(employee.id)}>Delete</button>
                  </>
                ) : (
                  <p>You do not have permission to perform actions on this employee.</p>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default HR;
