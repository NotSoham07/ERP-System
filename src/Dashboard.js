import React, { useEffect, useState } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { useAuth } from './AuthContext';
import { supabase } from './supabaseClient';
import { useNavigate } from 'react-router-dom';
import './index.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
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

  const doughnutData = {
    labels: ['Revenue', 'Expenses'],
    datasets: [
      {
        label: 'Finance',
        data: [totalRevenue, totalRevenue * 0.4],
        backgroundColor: ['#4caf50', '#f44336'],
      },
    ],
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-xl font-bold mb-4">Employees Salary</h3>
          <div className="chart-container">
            <Line data={lineData} />
          </div>
        </div>
        <div className="card">
          <h3 className="text-xl font-bold mb-4">Inventory Quantity</h3>
          <div className="chart-container">
            <Bar data={barData} />
          </div>
        </div>
        <div className="card">
          <h3 className="text-xl font-bold mb-4">Finance Overview</h3>
          <div className="chart-container">
            <Doughnut data={doughnutData} />
          </div>
        </div>
      </div>
      <button onClick={handleLogout} className="mt-6 bg-red-500 text-white p-2 rounded">Logout</button>
    </div>
  );
};

export default Dashboard;
