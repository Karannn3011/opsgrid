import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/services/api'; // Ensure you have this configured
import { 
  Truck, 
  Users, 
  AlertTriangle, 
  Package,
  RefreshCw 
} from 'lucide-react';
import FleetStatusChart from '@/components/charts/FleetStatusChart';
import { Button } from '@/components/ui/button';

// Helper to calculate totals from the summary lists if needed
const getCount = (summary, status) => {
  const item = summary.find(s => s.status === status);
  return item ? item.count : 0;
};

// Tactical Metric Component (Unchanged style, just lighter data props)
const TacticalMetric = ({ label, value, subtext, icon: Icon, alert }) => (
  <div className={`flex flex-col p-4 border bg-card/50 relative overflow-hidden group transition-all ${alert ? 'border-destructive/50 bg-destructive/5' : 'border-border hover:border-primary/50'}`}>
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

export default function DashboardHomePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  
  // Real Data State
  const [stats, setStats] = useState({
    totalDrivers: 0,
    activeTrucks: 0,
    pendingShipments: 0,
    openIssues: 0
  });

  const [truckSummary, setTruckSummary] = useState([]);
  const [shipmentSummary, setShipmentSummary] = useState([]);

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

  // Prepare Chart Data
  const fleetChartData = {
    active: getCount(truckSummary, 'ACTIVE'),
    maintenance: getCount(truckSummary, 'MAINTENANCE'),
    idle: getCount(truckSummary, 'IDLE'),
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

      {/* Real Metrics Grid - 4 Columns */}
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
        
        {/* Left Column: Fleet Status */}
        <div className="border border-border bg-card p-4 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider">Fleet Composition</h3>
            <Truck className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="flex-1 flex items-center justify-center min-h-[250px]">
             {/* Reusing your FleetStatusChart */}
             <FleetStatusChart data={fleetChartData} />
          </div>
          {/* Legend/Data Footer */}
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

        {/* Right Column: Recent Shipment Activity (Simplified to a text list for now, or another chart) */}
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
}