import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterCompanyPage from '../pages/auth/RegisterCompanyPage';
import SetPasswordPage from '../pages/auth/SetPasswordPage';

// Import Layout and Pages
import DashboardLayout from '../components/layout/DashboardLayout';
import TrucksPage from '../pages/dashboard/TrucksPage';
import UsersPage from '../pages/dashboard/UsersPage'; // Import UsersPage
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute'; // Import AdminRoute

function AppRouter() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-gray-700 dark:text-gray-300">Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterCompanyPage />} />
        <Route path="/set-password" element={<SetPasswordPage />} />

        {/* Protected Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="trucks" replace />} />
          <Route path="trucks" element={<TrucksPage />} />
          <Route path="drivers" element={<div>Drivers Page Content</div>} />
          <Route path="shipments" element={<div>Shipments Page Content</div>} />
          <Route path="issues" element={<div>Issues Page Content</div>} />
          
          {/* Admin Only Route */}
          <Route 
            path="users" 
            element={
              <AdminRoute>
                <UsersPage />
              </AdminRoute>
            } 
          />
        </Route>
        
      </Routes>
    </Router>
  );
}

export default AppRouter;