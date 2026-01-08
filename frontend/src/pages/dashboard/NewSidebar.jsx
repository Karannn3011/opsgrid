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
  useSidebar,
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
} from 'lucide-react';

export default function NewSidebar() {
  const { isMobile } = useIsMobile();
  const { toggleSidebar } = useSidebar();
  const { user } = useAuth();
  const isAdmin = user?.roles?.includes('ROLE_ADMIN');
  const isManager = user?.roles?.includes('ROLE_MANAGER');

  const handleLinkClick = () => {
    if (isMobile) {
      toggleSidebar();
    }
  };

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarContent>
        {/* Logo Area - Updated */}
        <div className="p-4 border-b border-sidebar-border group-data-[collapsible=icon]:p-2 transition-[padding]">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tighter group-data-[collapsible=icon]:justify-center">
            {/* Logo: Always visible, prevents shrinking */}
            <img 
              src="/favicon.svg" 
              alt="OpsGrid Logo" 
              className="h-6 w-6 shrink-0" 
            />
            {/* Text: Hidden when sidebar is collapsed (icon mode) */}
            <span className="group-data-[collapsible=icon]:hidden transition-opacity duration-200 whitespace-nowrap">
              OPSGRID
            </span>
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="uppercase tracking-widest text-[10px] font-bold text-sidebar-foreground/60 mt-2 group-data-[collapsible=icon]:hidden">
            Operations
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Dashboard">
                  <NavLink to="/dashboard" end onClick={handleLinkClick}>
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Overview</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Trucks">
                  <NavLink to="/dashboard/trucks" onClick={handleLinkClick}>
                    <Truck className="h-4 w-4" />
                    <span>Fleet</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Drivers">
                  <NavLink to="/dashboard/drivers" onClick={handleLinkClick}>
                    <Users className="h-4 w-4" />
                    <span>Personnel</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Shipments">
                  <NavLink to="/dashboard/shipments" onClick={handleLinkClick}>
                    <Package className="h-4 w-4" />
                    <span>Logistics</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Issues">
                  <NavLink to="/dashboard/issues" onClick={handleLinkClick}>
                    <AlertTriangle className="h-4 w-4" />
                    <span>Incidents</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {(isAdmin || isManager) && (
          <SidebarGroup>
            <SidebarGroupLabel className="uppercase tracking-widest text-[10px] font-bold text-sidebar-foreground/60 mt-4 group-data-[collapsible=icon]:hidden">
              Management
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Maintenance">
                    <NavLink to="/dashboard/maintenance" onClick={handleLinkClick}>
                      <Wrench className="h-4 w-4" />
                      <span>Maintenance</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Finance">
                    <NavLink to="/dashboard/finance" onClick={handleLinkClick}>
                      <DollarSign className="h-4 w-4" />
                      <span>Ledger</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel className="uppercase tracking-widest text-[10px] font-bold text-sidebar-foreground/60 mt-4 group-data-[collapsible=icon]:hidden">
              System
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="User Management">
                    <NavLink to="/dashboard/users" onClick={handleLinkClick}>
                      <UserCog className="h-4 w-4" />
                      <span>Access Control</span>
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