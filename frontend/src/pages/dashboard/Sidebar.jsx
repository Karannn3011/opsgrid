import React from 'react';
import { NavLink } from 'react-router-dom';
import { Truck, Users, Package, AlertTriangle } from 'lucide-react'; // Icons

const Sidebar = () => {
  // Common style for NavLink
  const linkClass = "flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700";
  const activeLinkClass = "bg-blue-100 text-blue-700 dark:bg-gray-700 dark:text-white";

  return (
    <div className="flex w-64 flex-col bg-white shadow-lg dark:bg-gray-800 dark:border-r dark:border-gray-700">
      <div className="flex h-16 items-center justify-center border-b dark:border-gray-700">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">OpsGrid</h1>
      </div>
      <nav className="flex-1 px-2 py-4">
        <NavLink 
          to="/dashboard/trucks" 
          className={({ isActive }) => `${linkClass} ${isActive ? activeLinkClass : ''}`}
        >
          <Truck className="mr-3 h-5 w-5" />
          Trucks
        </NavLink>
        <NavLink 
          to="/dashboard/drivers" 
          className={({ isActive }) => `${linkClass} ${isActive ? activeLinkClass : ''}`}
        >
          <Users className="mr-3 h-5 w-5" />
          Drivers
        </NavLink>
        <NavLink 
          to="/dashboard/shipments" 
          className={({ isActive }) => `${linkClass} ${isActive ? activeLinkClass : ''}`}
        >
          <Package className="mr-3 h-5 w-5" />
          Shipments
        </NavLink>
        <NavLink 
          to="/dashboard/issues" 
          className={({ isActive }) => `${linkClass} ${isActive ? activeLinkClass : ''}`}
        >
          <AlertTriangle className="mr-3 h-5 w-5" />
          Issues
        </NavLink>
        {/* Add more links as needed */}
      </nav>
    </div>
  );
};

export default Sidebar;
