import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar, // 1. Import the useSidebar hook
} from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import {
  Truck,
  Users,
  Package,
  AlertTriangle,
  UserCog,
  LayoutDashboard,
  DollarSign,
  Wrench,
  LogOut,
} from 'lucide-react';

export default function NewSidebar() {
  const { isMobile } = useIsMobile();
  const { toggleSidebar } = useSidebar(); // 2. Get the toggleSidebar function from the hook
  const { user, logout } = useAuth();
  const isAdmin = user?.roles?.includes('ROLE_ADMIN');
  const isManager = user?.roles?.includes('ROLE_MANAGER');

  // 3. Create the onClick handler function
  const handleLinkClick = () => {
    
      toggleSidebar();
  
  };

  return (
    <Sidebar collapsible={isMobile ? 'offcanvas' : 'icon'}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className={"text-xl mb-4 mx-auto"}>OpsGrid</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Dashboard Link */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  {/* 4. Add the onClick handler to the NavLink */}
                  <NavLink to="/dashboard" end onClick={handleLinkClick}>
                    <LayoutDashboard />
                    <span>Dashboard</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Apply the same onClick handler to all other NavLink items */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/dashboard/trucks" onClick={handleLinkClick}>
                    <Truck />
                    <span>Trucks</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/dashboard/drivers" onClick={handleLinkClick}>
                    <Users />
                    <span>Drivers</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/dashboard/shipments" onClick={handleLinkClick}>
                    <Package />
                    <span>Shipments</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/dashboard/issues" onClick={handleLinkClick}>
                    <AlertTriangle />
                    <span>Issues</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {(isAdmin || isManager) && (
          <SidebarGroup>
            <SidebarGroupLabel>Management</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/dashboard/maintenance" onClick={handleLinkClick}>
                      <Wrench />
                      <span>Maintenance</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/dashboard/finance" onClick={handleLinkClick}>
                      <DollarSign />
                      <span>Finance</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>Administration</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/dashboard/users" onClick={handleLinkClick}>
                      <UserCog />
                      <span>User Management</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      
    </Sidebar>
  );
}