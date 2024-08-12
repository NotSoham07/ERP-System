import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import Login from './Login';
import Signup from './Signup';
import Dashboard from './Dashboard';
import HR from './HR';
import Finance from './Finance';
import Inventory from './Inventory';
import Projects from './Projects';
import Sidebar from './Sidebar';
import Notification from './Notification';
import RoleSelection from './RoleSelection';
import AdminSignup from './AdminSignup';
import './App.css';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, roles } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && !roles.includes(requiredRole)) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

function App() {
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [selectedRole, setSelectedRole] = useState('');

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification({ message: '', type: '' });
    }, 3000);
  };

  return (
    <AuthProvider>
      <Router>
        <div className="flex">
          <Sidebar />
          <div className="flex-1 p-6">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/hr"
                element={
                  <ProtectedRoute>
                    <HR />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/finance"
                element={
                  <ProtectedRoute>
                    <Finance />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/inventory"
                element={
                  <ProtectedRoute>
                    <Inventory />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/projects"
                element={
                  <ProtectedRoute>
                    <Projects />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/roles"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <RoleSelection onSelectRole={setSelectedRole} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/signup"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminSignup selectedRole={selectedRole} />
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
          </div>
        </div>
        <Notification message={notification.message} type={notification.type} />
      </Router>
    </AuthProvider>
  );
}

export default App;
