import React, { useState, useEffect, useCallback } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";
import MaintenanceTable from "../../components/MaintenanceTable"; // We will create this
import PaginationControls from "../../components/common/PaginationControls";
import { Loader, RefreshCw, Wrench, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

function MaintenancePage() {
  const { user } = useAuth();

  // 1. SECURITY: NO DRIVERS ALLOWED
  if (user?.roles?.includes('ROLE_DRIVER')) {
    return <Navigate to="/dashboard" replace />;
  }

  useEffect(() => {
    document.title = "OpsGrid | Maintenance Command";
  }, []);

  const [activeRepairs, setActiveRepairs] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination for History
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const PAGE_SIZE = 5;

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      
      // 1. Fetch Trucks currently IN_REPAIR
      // We fetch all trucks and filter (unless you have a specific endpoint)
      const trucksRes = await api.get('/trucks?size=100');
      const allTrucks = trucksRes.data.content || [];
      const inRepair = allTrucks.filter(t => t.status === 'IN_REPAIR');
      setActiveRepairs(inRepair);

      // 2. Fetch Maintenance Expense History
      // We fetch expenses and filtering done on backend if supported, or frontend
      // Assuming backend supports sort. We will filter for 'MAINTENANCE' in frontend for now.
      const expensesRes = await api.get(`/finance/expenses?page=${currentPage}&size=${PAGE_SIZE}&sort=expenseDate,desc`);
      const allExpenses = expensesRes.data.content || [];
      // Filter only MAINTENANCE category expenses
      const maintHistory = allExpenses.filter(e => e.category === 'MAINTENANCE');
      
      setHistory(maintHistory);
      setTotalPages(expensesRes.data.totalPages);

    } catch (err) {
      console.error("Failed to load maintenance data", err);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Action: Mark Truck as Fixed
  const handleMarkFixed = async (truckId) => {
    if(!window.confirm("Confirm: Unit repairs completed and vehicle is operational?")) return;
    
    try {
        // We need to fetch the truck details first to keep other data intact, 
        // or if your backend supports PATCH, use that. 
        // Here we assume standard PUT with full object, so we find the truck locally first.
        const truck = activeRepairs.find(t => t.id === truckId);
        if(!truck) return;

        const payload = { ...truck, status: 'WORKING' };
        await api.put(`/trucks/${truckId}`, payload);
        
        // Refresh
        fetchData();
    } catch (err) {
        alert("Failed to update status.");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground uppercase">
            Maintenance Command
          </h1>
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
            Fleet Readiness & Repair Logs
          </p>
        </div>
        <div className="flex gap-2">
            <Button variant="tactical" size="sm" onClick={fetchData}>
                <RefreshCw className="w-4 h-4 mr-2" />
                SYNC STATUS
            </Button>
        </div>
      </div>

      {/* SECTION 1: ACTIVE REPAIRS */}
      <div className="space-y-4">
         <div className="flex items-center gap-2 text-destructive">
            <Wrench className="w-4 h-4" />
            <h2 className="text-sm font-bold uppercase tracking-wider">Active Repair Orders ({activeRepairs.length})</h2>
         </div>
         
         {loading ? (
             <div className="p-8 border border-dashed border-border flex justify-center">
                 <Loader className="animate-spin w-6 h-6 text-primary" />
             </div>
         ) : activeRepairs.length === 0 ? (
             <div className="p-6 border border-border bg-emerald-500/5 text-emerald-600 rounded-sm flex items-center gap-3">
                 <CheckCircle className="w-5 h-5" />
                 <span className="font-mono text-xs uppercase font-bold">All Units Operational</span>
             </div>
         ) : (
             <div className="border border-border bg-card overflow-hidden">
                <table className="w-full text-left text-sm">
                   <thead className="bg-destructive/10 text-xs uppercase text-destructive font-mono">
                      <tr>
                         <th className="px-4 py-2 font-medium border-b border-border">Unit ID</th>
                         <th className="px-4 py-2 font-medium border-b border-border">Model</th>
                         <th className="px-4 py-2 font-medium border-b border-border">Status</th>
                         <th className="px-4 py-2 font-medium border-b border-border text-right">Action</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-border/50">
                      {activeRepairs.map(truck => (
                         <tr key={truck.id} className="group hover:bg-secondary/20">
                            <td className="px-4 py-3 font-mono font-bold">{truck.licensePlate}</td>
                            <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{truck.make} {truck.model}</td>
                            <td className="px-4 py-3">
                                <span className="inline-flex items-center px-2 py-0.5 rounded-sm bg-destructive/10 text-destructive border border-destructive/20 text-[10px] font-bold uppercase">
                                   In Repair
                                </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                                <Button 
                                   size="sm" 
                                   variant="outline"
                                   className="h-7 text-[10px] uppercase border-emerald-500/30 text-emerald-600 hover:bg-emerald-50"
                                   onClick={() => handleMarkFixed(truck.id)}
                                >
                                   <CheckCircle className="w-3 h-3 mr-1" /> Mark Operational
                                </Button>
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
         )}
      </div>

      {/* SECTION 2: HISTORY */}
      <div className="space-y-4 pt-4 border-t border-border">
         <div className="flex items-center gap-2 text-muted-foreground">
            <h2 className="text-sm font-bold uppercase tracking-wider">Recent Service Logs</h2>
         </div>

         <MaintenanceTable 
            history={history} 
            loading={loading}
         />
         
         {totalPages > 1 && (
            <div className="mt-2">
                <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            </div>
         )}
      </div>
    </div>
  );
}

export default MaintenancePage;