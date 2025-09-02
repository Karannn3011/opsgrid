import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterCompanyPage from '../pages/auth/RegisterCompanyPage';

// Import Layout and Pages
import DashboardLayout from '../components/layout/DashboardLayout';
import TrucksPage from '../pages/dashboard/TrucksPage';
import ProtectedRoute from './ProtectedRoute';

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

        {/* Protected Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* Child routes of the dashboard */}
          {/* Redirect /dashboard to /dashboard/trucks */}
          <Route index element={<Navigate to="trucks" replace />} />
          <Route path="trucks" element={<TrucksPage />} />
          {/* Add placeholders for other pages */}
          <Route path="drivers" element={<div>Drivers Page Content</div>} />
          <Route path="shipments" element={<div>Shipments Page Content</div>} />
          <Route path="issues" element={<div>Issues Page Content</div>} />
        </Route>
        
      </Routes>
    </Router>
  );
}

export default AppRouter;