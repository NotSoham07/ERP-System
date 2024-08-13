import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import Login from './Login';
import Signup from './Signup';
import Dashboard from './Dashboard';
import HR from './HR';
import Finance from './Finance';
import Inventory from './Inventory';
import Projects from './Projects';
import Sidebar from './Sidebar';
import RoleSelection from './RoleSelection';
import AdminSignup from './AdminSignup';
import Notification from './Notification';  // Ensure correct import
import './index.css';

const ProtectedRoute = ({ children, rolesAllowed }) => {
  const { user, roles } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (rolesAllowed && !rolesAllowed.some(role => roles.includes(role))) return <Navigate to="/dashboard" />;
  return children;
};

function AppContent() {
  const [notification, setNotification] = useState({ message: '', type: '' });
  const location = useLocation(); // Get the current location

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification({ message: '', type: '' });
    }, 3000);
  };

  const hideSidebar = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div className="flex">
      {!hideSidebar && <Sidebar />} {/* Conditionally render the Sidebar */}
      <div className={`flex-1 p-6 ${hideSidebar ? '' : 'padded-content'}`}>
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
              <ProtectedRoute rolesAllowed={['admin']}>
                <RoleSelection />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/signup"
            element={
              <ProtectedRoute rolesAllowed={['admin']}>
                <AdminSignup />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
      <Notification message={notification.message} type={notification.type} />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
