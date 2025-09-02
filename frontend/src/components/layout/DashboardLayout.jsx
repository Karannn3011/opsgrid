import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../pages/dashboard/Sidebar.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';

function DashboardLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <div>
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
          </div>
          <div className="flex items-center">
            <span className="mr-4 text-sm text-gray-700 dark:text-gray-300">
              Welcome, {user?.username}
            </span>
            <button
              onClick={logout}
              className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {/* The Outlet component renders the matched child route's component */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
