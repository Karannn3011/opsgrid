import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    // Should be caught by ProtectedRoute, but as a fallback
    return <Navigate to="/login" />;
  }

  if (!user.roles.includes('ROLE_ADMIN')) {
    // If user is not an admin, redirect them to a default page (e.g., trucks)
    return <Navigate to="/dashboard/trucks" />;
  }

  // If user is an admin, render the requested component
  return children ? children : <Outlet />;
};

export default AdminRoute;