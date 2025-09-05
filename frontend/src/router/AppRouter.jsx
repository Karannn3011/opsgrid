import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterCompanyPage from "../pages/auth/RegisterCompanyPage";
import SetPasswordPage from "../pages/auth/SetPasswordPage";

// Import Layout and Pages
import DashboardLayout from "../components/layout/DashboardLayout";
import TrucksPage from "../pages/dashboard/TrucksPage";
import UsersPage from "../pages/dashboard/UsersPage";
import DriversPage from "../pages/dashboard/DriversPage";
import ShipmentsPage from "../pages/dashboard/ShipmentsPage";
import IssuesPage from "../pages/dashboard/IssuesPage";
import FinancePage from "../pages/dashboard/FinancePage"; // Import FinancePage
import MaintenancePage from "../pages/dashboard/MaintenancePage";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";
import DashboardHomePage from "../pages/dashboard/DashboardHomePage";

function AppRouter() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
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
          <Route index element={<DashboardHomePage />} />
          <Route path="trucks" element={<TrucksPage />} />
          <Route path="drivers" element={<DriversPage />} />
          <Route path="shipments" element={<ShipmentsPage />} />
          <Route path="issues" element={<IssuesPage />} />
          <Route path="maintenance" element={<MaintenancePage />} />
          <Route path="finance" element={<FinancePage />} />{" "}
          {/* Add Finance Route */}
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
