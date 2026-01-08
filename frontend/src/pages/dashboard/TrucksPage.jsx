import React, { useState, useEffect, useCallback } from "react";
import { Navigate } from "react-router-dom"; // For redirect
import { useAuth } from "../../contexts/AuthContext";
import { Loader, Plus, RefreshCw, Truck } from "lucide-react";
import api from "../../services/api";
import TrucksTable from "../../components/TrucksTable";
import Modal from "../../components/common/Modal";
import TruckForm from "../../components/TruckForm";
import PaginationControls from "../../components/common/PaginationControls";
import { Button } from "@/components/ui/button";

function TrucksPage() {
  const { user } = useAuth();
  
  // 1. SECURITY: Redirect Drivers away from this page
  if (user?.roles?.includes('ROLE_DRIVER')) {
    return <Navigate to="/dashboard" replace />;
  }

  useEffect(() => {
      document.title = "OpsGrid | Fleet Command"
  }, [])

  const [trucks, setTrucks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const PAGE_SIZE = 10;

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTruck, setEditingTruck] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchTrucks = useCallback(async (page) => {
    try {
      setLoading(true);
      const response = await api.get(
        `/trucks?page=${page}&size=${PAGE_SIZE}&sort=createdAt,desc`,
      );
      const pageData = response.data;

      setTrucks(pageData.content);
      setTotalPages(pageData.totalPages);
      setCurrentPage(pageData.number);
      setError(null);
    } catch (err) {
      setError("Failed to fetch fleet data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrucks(currentPage);
  }, [fetchTrucks, currentPage]);

  const handleAddTruck = async (formData) => {
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        year: parseInt(formData.year, 10),
        capacityKg: parseInt(formData.capacityKg, 10),
      };
      await api.post("/trucks", payload);
      setIsAddModalOpen(false);
      fetchTrucks(currentPage); // Refresh list
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add unit.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateTruck = async (formData) => {
    if (!editingTruck) return;
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        year: parseInt(formData.year, 10),
        capacityKg: parseInt(formData.capacityKg, 10),
      };
      await api.put(`/trucks/${editingTruck.id}`, payload);
      setIsEditModalOpen(false);
      setEditingTruck(null);
      fetchTrucks(currentPage);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update unit.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (truckId) => {
    if (window.confirm("CONFIRM DECOMMISSION: This action cannot be undone.")) {
      try {
        await api.delete(`/trucks/${truckId}`);
        fetchTrucks(currentPage);
      } catch (err) {
        alert("Failed to delete unit.");
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground uppercase">
            Fleet Command
          </h1>
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
            Active Units & Maintenance Status
          </p>
        </div>
        <div className="flex gap-2">
            <Button variant="tactical" size="sm" onClick={() => fetchTrucks(currentPage)}>
                <RefreshCw className="w-4 h-4 mr-2" />
                SYNC
            </Button>
            <Button variant="default" size="sm" onClick={() => setIsAddModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                ADD UNIT
            </Button>
        </div>
      </div>

      {/* Content Area */}
      {(loading && trucks.length === 0) ? (
          <div className="flex flex-col items-center justify-center p-12 border border-dashed border-border rounded-sm">
             <Loader className="h-8 w-8 animate-spin text-primary mb-4" />
             <span className="text-xs font-mono uppercase text-muted-foreground">Accessing Fleet Database...</span>
          </div>
      ) : error ? (
          <div className="p-4 border border-destructive/50 bg-destructive/10 text-destructive text-xs font-mono uppercase">
             Error: {error}
          </div>
      ) : (
        <>
          <TrucksTable
            trucks={trucks}
            onEdit={(truck) => {
                setEditingTruck(truck);
                setIsEditModalOpen(true);
            }}
            onDelete={handleDelete}
          />
          <div className="mt-4">
            <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
          </div>
        </>
      )}

      {/* Modals - Reusing the Modal component but passing tactical styling if possible */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="REGISTER NEW UNIT"
      >
        <TruckForm
          onSubmit={handleAddTruck}
          onCancel={() => setIsAddModalOpen(false)}
          submitting={submitting}
        />
      </Modal>

      {editingTruck && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title={`EDIT UNIT: ${editingTruck.licensePlate}`}
        >
          <TruckForm
            onSubmit={handleUpdateTruck}
            onCancel={() => setIsEditModalOpen(false)}
            initialData={editingTruck}
            submitting={submitting}
          />
        </Modal>
      )}
    </div>
  );
}

export default TrucksPage;