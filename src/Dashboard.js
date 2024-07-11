import React from 'react';
import { Link } from 'react-router-dom';

function Dashboard() {
  return (
    <div>
      <h2>Dashboard</h2>
      <nav>
        <ul>
          <li><Link to="/hr">HR Module</Link></li>
          <li><Link to="/finance">Finance Module</Link></li>
          <li><Link to="/inventory">Inventory Module</Link></li>
        </ul>
      </nav>
    </div>
  );
}

export default Dashboard;
