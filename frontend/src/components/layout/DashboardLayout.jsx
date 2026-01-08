import React from "react";
import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "../ui/sidebar";
import NewSidebar from "../../pages/dashboard/NewSidebar";
import { useAuth } from "../../contexts/AuthContext";
import { Separator } from "../ui/separator";

export default function DashboardLayout() {
  const { user, logout } = useAuth();

  return (
    <SidebarProvider>
      <NewSidebar />
      <SidebarInset>
        {/* Header: Tactical Style */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b bg-background px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-14">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            {/* Display Company Name in Uppercase */}
            <h1 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              {user?.companyName || "OPSGRID LOGISTICS"}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Removed: System Optimal Indicator */}

            <span className="hidden text-sm font-mono text-foreground sm:inline">
              Welcome, {user?.username}
            </span>
            <button
              className="rounded-sm bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive hover:text-white transition-colors uppercase tracking-wider cursor-pointer"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        </header>

        {/* Main Content with Technical Grid Background */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative">
           <div className="absolute inset-0 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] -z-10 pointer-events-none"></div>
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}