import React from "react";
import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "../ui/sidebar";
import NewSidebar from "../../pages/dashboard/NewSidebar"; // Make sure this path is correct
import { useAuth } from "../../contexts/AuthContext";

export default function DashboardLayout() {
  const { user, logout } = useAuth();

  return (
    <SidebarProvider>
      <NewSidebar />
      <SidebarInset>
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">
              Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {/* This span will be hidden on extra-small screens and visible on small screens and up */}
            <span className="hidden text-sm text-gray-700 sm:inline dark:text-gray-300">
              Welcome, {user?.username}
            </span>
            <button
              className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
