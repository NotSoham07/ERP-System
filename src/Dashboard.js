import React, { useEffect, useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { useAuth } from './AuthContext';
import { supabase } from './supabaseClient';
import { useNavigate } from 'react-router-dom';
import './App.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: employeesData, error: employeesError } = await supabase.from('Employees').select('*');
    const { data: inventoryData, error: inventoryError } = await supabase.from('Inventory').select('*');
    const { data: transactionsData, error: transactionsError } = await supabase.from('Transactions').select('*');

    if (employeesError) console.error('Error fetching employees:', employeesError.message);
    if (inventoryError) console.error('Error fetching inventory:', inventoryError.message);
    if (transactionsError) console.error('Error fetching transactions:', transactionsError.message);

    setEmployees(employeesData || []);
    setInventory(inventoryData || []);
    setTransactions(transactionsData || []);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const employeeCount = employees.length;
  const inventoryCount = inventory.length;
  const totalRevenue = transactions.reduce((sum, txn) => sum + txn.amount, 0);

  const lineData = {
    labels: employees.map(emp => emp.name),
    datasets: [
      {
        label: 'Salary',
        data: employees.map(emp => emp.salary),
        fill: false,
        borderColor: '#4caf50',
        pointBackgroundColor: '#4caf50',
        pointBorderColor: '#fff',
        pointRadius: 5,
      },
    ],
  };

  const barData = {
    labels: inventory.map(item => item.name),
    datasets: [
      {
        label: 'Quantity',
        data: inventory.map(item => item.quantity),
        backgroundColor: ['#4caf50', '#ff9800', '#2196f3', '#f44336', '#9c27b0'],
      },
    ],
  };

  return (
    <div className="content">
      <div className="card">
        <h3>Employees Salary</h3>
        <div className="chart-container">
          <Line data={lineData} />
        </div>
      </div>
      <div className="card">
        <h3>Inventory Quantity</h3>
        <div className="chart-container">
          <Bar data={barData} />
        </div>
      </div>
      <div className="card">
        <h3>Total Revenue</h3>
        <p>${totalRevenue}</p>
      </div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
