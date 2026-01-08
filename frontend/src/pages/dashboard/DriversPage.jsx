import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";
import DriversTable from "../../components/DriversTable";
import Modal from "../../components/common/Modal";
import DriverForm from "../../components/DriverForm";
import PaginationControls from "../../components/common/PaginationControls";
import { Loader, UserPlus, RefreshCw, User, Truck, Phone, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";

// --- SUB-COMPONENT: Driver Service Record (View for Drivers) ---
const DriverServiceRecord = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // This calls the /me endpoint instead of the forbidden /drivers endpoint
        const { data } = await api.get('/drivers/me');
        setProfile(data);
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <div className="p-8 text-center font-mono text-xs uppercase animate-pulse">Loading Service Record...</div>;
  if (!profile) return <div className="p-8 text-center font-mono text-xs uppercase text-destructive">Profile Not Found</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-500">
      <div className="border-b border-border pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground uppercase">
          Service Record
        </h1>
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
          Personnel Identification & Status
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {/* ID Card Column */}
         <div className="md:col-span-1 border border-border bg-card p-4 flex flex-col items-center text-center space-y-4">
            <div className="w-32 h-32 bg-secondary rounded-sm flex items-center justify-center border border-dashed border-border">
               <User className="w-12 h-12 text-muted-foreground/50" />
            </div>
            <div>
              <div className="text-lg font-bold uppercase tracking-tight">{profile.fullName}</div>
              <div className="text-xs font-mono text-primary uppercase">Active Operator</div>
            </div>
            <div className="w-full border-t border-border pt-4 text-left space-y-2">
               <div>
                 <span className="text-[10px] uppercase text-muted-foreground block">Employee ID</span>
                 <span className="text-xs font-mono">{profile.username}</span>
               </div>
               <div>
                 <span className="text-[10px] uppercase text-muted-foreground block">Company</span>
                 <span className="text-xs font-mono">{profile.companyName}</span>
               </div>
            </div>
         </div>

         {/* Details Column */}
         <div className="md:col-span-2 space-y-4">
            {/* License & Contact */}
            <div className="border border-border bg-card p-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-2 opacity-5">
                 <Hash className="w-24 h-24" />
               </div>
               <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Credentials</h3>
               <div className="grid grid-cols-2 gap-6">
                 <div>
                    <div className="flex items-center gap-2 mb-1">
                       <Hash className="w-3 h-3 text-primary" />
                       <span className="text-[10px] uppercase text-muted-foreground">License Number</span>
                    </div>
                    <div className="text-lg font-mono">{profile.licenseNumber}</div>
                 </div>
                 <div>
                    <div className="flex items-center gap-2 mb-1">
                       <Phone className="w-3 h-3 text-primary" />
                       <span className="text-[10px] uppercase text-muted-foreground">Contact</span>
                    </div>
                    <div className="text-lg font-mono">{profile.contactNumber}</div>
                 </div>
               </div>
            </div>

            {/* Assigned Asset */}
            <div className="border border-border bg-card p-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-2 opacity-5">
                 <Truck className="w-24 h-24" />
               </div>
               <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Assigned Asset</h3>
               {profile.assignedTruckId ? (
                 <div className="space-y-2">
                    <div className="text-2xl font-mono font-bold tracking-tighter text-primary">
                       {profile.assignedTruckLicensePlate}
                    </div>
                    <div className="text-xs font-mono text-muted-foreground uppercase">
                       ID: #{profile.assignedTruckId} • Status: <span className="text-emerald-500">Operational</span>
                    </div>
                 </div>
               ) : (
                 <div className="text-sm font-mono text-muted-foreground uppercase py-2">
                   No vehicle currently assigned
                 </div>
               )}
            </div>
         </div>
      </div>
    </div>
  );
};


// --- MAIN COMPONENT: Drivers Page (Manager View) ---
function DriversPage() {
  const { user } = useAuth();

  // 1. ROLE CHECK: If driver, show Service Record
  if (user?.roles?.includes('ROLE_DRIVER')) {
    return <DriverServiceRecord />;
  }

  // --- ADMIN/MANAGER LOGIC BELOW ---
  useEffect(() => {
      document.title = "OpsGrid | Personnel"
  }, [])

  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const PAGE_SIZE = 10;

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);

  const fetchDrivers = useCallback(async (page) => {
    try {
      setLoading(true);
      const response = await api.get(
        `/drivers?page=${page}&size=${PAGE_SIZE}&sort=fullName,asc`,
      );
      const pageData = response.data;
      setDrivers(pageData.content);
      setTotalPages(pageData.totalPages);
      setCurrentPage(pageData.number);
      setError(null);
    } catch (err) {
      setError("Failed to fetch personnel manifest.");
      setTotalPages(0); 
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDrivers(currentPage);
  }, [fetchDrivers, currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  const refreshAndCloseModals = () => {
    if (currentPage === 0) {
        fetchDrivers(0);
    } else {
        setCurrentPage(0);
    }
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setEditingDriver(null);
  };

  const handleCreateProfile = async (formData) => {
    await api.post("/drivers", formData);
    refreshAndCloseModals();
  };

  const handleEditClick = (driver) => {
    setEditingDriver(driver);
    setIsEditModalOpen(true);
  };

  const handleUpdateProfile = async (formData) => {
    await api.put(`/drivers/${editingDriver.userId}`, formData);
    refreshAndCloseModals();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground uppercase">
            Personnel Manifest
          </h1>
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
            Operator Profiles & Assignments
          </p>
        </div>
        <div className="flex gap-2">
            <Button variant="tactical" size="sm" onClick={() => fetchDrivers(currentPage)}>
                <RefreshCw className="w-4 h-4 mr-2" />
                SYNC
            </Button>
            <Button variant="default" size="sm" onClick={() => setIsCreateModalOpen(true)}>
                <UserPlus className="w-4 h-4 mr-2" />
                NEW PROFILE
            </Button>
        </div>
      </div>

      {/* Content */}
      {(loading || error) ? (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed border-border rounded-sm">
            {loading ? (
                <>
                  <Loader className="h-8 w-8 animate-spin text-primary mb-4" />
                  <span className="text-xs font-mono uppercase text-muted-foreground">Accessing Personnel Database...</span>
                </>
            ) : (
                <div className="text-destructive font-mono uppercase text-xs">Error: {error}</div>
            )}
        </div>
      ) : (
        <>
          <DriversTable drivers={drivers} onEdit={handleEditClick} />
          {totalPages > 1 && (
              <div className="mt-4">
                <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
              </div>
          )}
        </>
      )}

      {/* Modals */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="CREATE PERSONNEL PROFILE"
      >
        <DriverForm
          onSave={handleCreateProfile}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>

      {editingDriver && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingDriver(null);
          }}
          title={`EDIT PROFILE: ${editingDriver.fullName}`}
        >
          <DriverForm
            onSave={handleUpdateProfile}
            onCancel={() => {
              setIsEditModalOpen(false);
              setEditingDriver(null);
            }}
            initialData={editingDriver}
          />
        </Modal>
      )}
    </div>
  );
}

export default DriversPage;