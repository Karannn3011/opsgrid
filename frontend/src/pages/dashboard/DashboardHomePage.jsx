import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Added for navigation
import { useAuth } from '@/contexts/AuthContext';
import api from '@/services/api';
import { 
  Truck, 
  Users, 
  AlertTriangle, 
  Package,
  RefreshCw,
  MapPin,
  Navigation
} from 'lucide-react';
import FleetStatusChart from '@/components/charts/FleetStatusChart';
import { Button } from '@/components/ui/button';

// --- SHARED COMPONENTS ---

const TacticalMetric = ({ label, value, subtext, icon: Icon, alert, onClick }) => (
  <div 
    onClick={onClick}
    className={`flex flex-col p-4 border bg-card/50 relative overflow-hidden group transition-all cursor-pointer ${alert ? 'border-destructive/50 bg-destructive/5' : 'border-border hover:border-primary/50'}`}
  >
    <div className={`absolute top-0 right-0 w-2 h-2 border-t border-r transition-colors ${alert ? 'border-destructive' : 'border-primary/20 group-hover:border-primary'}`} />
    
    <div className="flex items-center justify-between mb-4">
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
        {label}
      </span>
      {Icon && <Icon className={`w-4 h-4 ${alert ? 'text-destructive' : 'text-primary/60'}`} />}
    </div>
    
    <div className="flex items-baseline gap-2">
      <span className="text-3xl font-mono font-bold text-foreground tracking-tight">
        {value}
      </span>
    </div>
    
    <p className="text-xs text-muted-foreground mt-2 font-mono">
      {subtext}
    </p>
  </div>
);

// --- DRIVER VIEW ---

const DriverDashboard = ({ user }) => {
  const navigate = useNavigate(); // Hook for redirection
  const [myDriver, setMyDriver] = useState(null);
  const [myTruck, setMyTruck] = useState(null);
  const [activeShipment, setActiveShipment] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDriverData = async () => {
    try {
      setLoading(true);
      // 1. Get My Profile
      const driverRes = await api.get('/drivers/me');
      setMyDriver(driverRes.data);

      // 2. Get My Truck (if assigned)
      if (driverRes.data.assignedTruckId) {
        const truckRes = await api.get(`/trucks/${driverRes.data.assignedTruckId}`);
        setMyTruck(truckRes.data);
      }

      // 3. Get My Active Shipments
      const shipmentsRes = await api.get('/shipments/my-active-shipments');
      const activeList = shipmentsRes.data || [];
      
      // UPDATED LOGIC: Only show if status is strictly 'IN_TRANSIT'
      const inTransitLoad = activeList.find(s => s.status === 'IN_TRANSIT');
      setActiveShipment(inTransitLoad || null);

    } catch (error) {
      console.error("Failed to load driver data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDriverData();
  }, []);

  if (loading) return <div className="p-8 text-center font-mono text-xs uppercase animate-pulse">Loading System Data...</div>;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Driver Header */}
      <div className="flex flex-col gap-1 border-b border-border pb-4">
        <h2 className="text-2xl font-bold uppercase tracking-tight">
          Welcome, {myDriver?.fullName || user.username}
        </h2>
        <span className="text-xs font-mono text-muted-foreground uppercase">
          License: {myDriver?.licenseNumber || "N/A"} • Status: <span className="text-emerald-500">Active</span>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CURRENT ASSIGNMENT CARD */}
        <div className="border border-primary/20 bg-primary/5 rounded-sm p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Truck className="w-24 h-24" />
          </div>
          
          <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-4">Current Vehicle</h3>
          
          {myTruck ? (
            <div className="space-y-2">
              <div className="text-4xl font-mono font-bold tracking-tighter">
                {myTruck.licensePlate}
              </div>
              <div className="text-sm font-mono text-muted-foreground uppercase">
                {myTruck.make} {myTruck.model} • {myTruck.year}
              </div>
              <div className="inline-flex items-center px-2 py-1 rounded-sm bg-background border border-border text-xs font-mono uppercase mt-2">
                <span className={`w-2 h-2 rounded-full mr-2 ${myTruck.status === 'WORKING' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                {myTruck.status === 'WORKING' ? 'Operational' : myTruck.status}
              </div>
            </div>
          ) : (
            <div className="text-muted-foreground py-4">No vehicle currently assigned.</div>
          )}
        </div>

        {/* ACTIVE LOAD CARD */}
        <div className="border border-border bg-card rounded-sm p-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Active Load</h3>
          
          {activeShipment ? (
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                   <span className="text-xs font-mono text-primary uppercase block mb-1">Origin</span>
                   <div className="text-lg font-semibold flex items-center gap-2">
                      <MapPin className="w-4 h-4" /> {activeShipment.origin}
                   </div>
                </div>
                <div className="text-right">
                   <span className="text-xs font-mono text-primary uppercase block mb-1">Destination</span>
                   <div className="text-lg font-semibold flex items-center gap-2 justify-end">
                      {activeShipment.destination} <MapPin className="w-4 h-4" />
                   </div>
                </div>
              </div>
              
              <div className="w-full bg-secondary h-1 rounded-full overflow-hidden relative">
                 <div className="absolute inset-y-0 left-0 bg-primary w-1/2 animate-pulse" />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border">
                <div className="text-xs font-mono uppercase text-muted-foreground">
                   ID: #{activeShipment.id}
                </div>
                <div className="text-xs font-mono uppercase font-bold text-primary">
                   {activeShipment.status.replace('_', ' ')}
                </div>
              </div>
            </div>
          ) : (
             <div className="h-32 flex flex-col items-center justify-center text-muted-foreground border border-dashed border-border rounded-sm">
                <Package className="w-8 h-8 mb-2 opacity-50" />
                <span className="text-xs uppercase">No shipment in transit</span>
             </div>
          )}
        </div>
      </div>

      {/* QUICK ACTIONS - Updated */}
      <div className="grid grid-cols-1 gap-4">
        {/* Removed Route Map Button */}
        
        {/* Report Issue Button - Full Width & Redirects */}
        <Button 
          variant="outline" 
          className="h-16 flex flex-row items-center justify-center gap-3 border-dashed text-destructive border-destructive/30 hover:bg-destructive/10 uppercase tracking-widest"
          onClick={() => navigate('/dashboard/issues')}
        >
           <AlertTriangle className="w-5 h-5" />
           Report Issue
        </Button>
      </div>
    </div>
  );
};

// --- ADMIN/MANAGER VIEW ---

const AdminDashboard = ({ user }) => {
  const [stats, setStats] = useState({
    totalDrivers: 0,
    activeTrucks: 0,
    pendingShipments: 0,
    openIssues: 0
  });
  const [truckSummary, setTruckSummary] = useState([]);
  const [shipmentSummary, setShipmentSummary] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, trucksRes, shipmentsRes] = await Promise.all([
        api.get('/analytics/stats'),
        api.get('/analytics/truck-summary'),
        api.get('/analytics/shipment-summary')
      ]);

      setStats(statsRes.data);
      setTruckSummary(trucksRes.data);
      setShipmentSummary(shipmentsRes.data);
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getCount = (summary, status) => {
    const item = summary.find(s => s.status === status);
    return item ? item.count : 0;
  };

  // MAPPING: Map Backend Status (WORKING/IN_REPAIR) to Frontend UI
  const fleetChartData = {
    active: getCount(truckSummary, 'WORKING'),
    maintenance: getCount(truckSummary, 'IN_REPAIR'),
    idle: getCount(truckSummary, 'OUT_OF_SERVICE'),
    total: truckSummary.reduce((acc, curr) => acc + curr.count, 0)
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
       {/* Top Action Bar */}
       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground uppercase">
            Operations Overview
          </h2>
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
            {new Date().toLocaleDateString()} // {user?.companyName || "OPSGRID"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="tactical" size="sm" onClick={fetchData} disabled={loading}>
            <RefreshCw className={`w-3 h-3 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <TacticalMetric 
          label="Active Fleet" 
          value={stats.activeTrucks} 
          subtext="Trucks currently on road"
          icon={Truck}
        />
        <TacticalMetric 
          label="Pending Loads" 
          value={stats.pendingShipments} 
          subtext="Waiting for assignment"
          icon={Package}
        />
        <TacticalMetric 
          label="Drivers" 
          value={stats.totalDrivers} 
          subtext="Total registered personnel"
          icon={Users}
        />
        <TacticalMetric 
          label="Open Issues" 
          value={stats.openIssues} 
          subtext="Requires resolution"
          icon={AlertTriangle}
          alert={stats.openIssues > 0}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="border border-border bg-card p-4 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider">Fleet Composition</h3>
            <Truck className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="flex-1 flex items-center justify-center min-h-[250px]">
             <FleetStatusChart data={fleetChartData} />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-4">
            <div className="text-center">
              <div className="text-[10px] text-muted-foreground uppercase">Active</div>
              <div className="font-mono font-bold text-lg text-primary">{fleetChartData.active}</div>
            </div>
            <div className="text-center border-l border-border">
              <div className="text-[10px] text-muted-foreground uppercase">Maint</div>
              <div className="font-mono font-bold text-lg text-destructive">{fleetChartData.maintenance}</div>
            </div>
            <div className="text-center border-l border-border">
              <div className="text-[10px] text-muted-foreground uppercase">Idle</div>
              <div className="font-mono font-bold text-lg text-muted-foreground">{fleetChartData.idle}</div>
            </div>
          </div>
        </div>

        <div className="border border-border bg-card p-4 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider">Shipment Status</h3>
            <Package className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="flex-1 overflow-y-auto">
             {shipmentSummary.length === 0 ? (
               <div className="h-full flex items-center justify-center text-muted-foreground text-xs uppercase">No shipment data available</div>
             ) : (
               <div className="space-y-2">
                 {shipmentSummary.map((item) => (
                   <div key={item.status} className="flex items-center justify-between p-3 border border-border/50 bg-secondary/20 rounded-sm">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          item.status === 'DELIVERED' ? 'bg-emerald-500' : 
                          item.status === 'IN_TRANSIT' ? 'bg-blue-500' : 
                          item.status === 'PENDING' ? 'bg-yellow-500' : 'bg-gray-500'
                        }`} />
                        <span className="text-xs font-mono uppercase">{item.status.replace('_', ' ')}</span>
                      </div>
                      <span className="font-mono font-bold">{item.count}</span>
                   </div>
                 ))}
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN WRAPPER ---

export default function DashboardHomePage() {
  const { user } = useAuth();
  
  if (user?.roles?.includes('ROLE_DRIVER')) {
    return <DriverDashboard user={user} />;
  }

  return <AdminDashboard user={user} />;
}