import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, roles } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (requiredRole && !roles.includes(requiredRole)) return <Navigate to="/not-authorized" />;
  return children;
};

export default ProtectedRoute;
