import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";
import ShipmentsTable from "../../components/ShipmentsTable";
import Modal from "../../components/common/Modal";
import CreateShipmentForm from "../../components/CreateShipmentForm";
import PaginationControls from "../../components/common/PaginationControls";
import { Loader, PackagePlus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

function ShipmentsPage() {
  const { user } = useAuth();
  const isDriver = user?.roles?.includes("ROLE_DRIVER");

  useEffect(() => {
    document.title = isDriver ? "OpsGrid | My Log" : "OpsGrid | Logistics Command";
  }, [isDriver]);

  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const PAGE_SIZE = 10;

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const fetchShipments = useCallback(async (page) => {
    try {
      setLoading(true);
      
      const endpoint = isDriver 
        ? `/shipments/my-shipments?page=${page}&size=${PAGE_SIZE}&sort=createdAt,desc`
        : `/shipments?page=${page}&size=${PAGE_SIZE}&sort=createdAt,desc`;

      const response = await api.get(endpoint);
      const pageData = response.data;

      setShipments(pageData.content);
      setTotalPages(pageData.totalPages);
      setCurrentPage(pageData.number);
      setError(null);
    } catch (err) {
      setError("Failed to retrieve logistics data.");
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [isDriver]);

  useEffect(() => {
    fetchShipments(currentPage);
  }, [fetchShipments, currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleCreateShipment = async (formData) => {
    setIsCreateModalOpen(false);
    fetchShipments(0); 
  };

  // --- NEW FUNCTION: Handle Status Changes ---
  const handleStatusUpdate = async (shipmentId, newStatus) => {
     // Optional: Add confirmation for critical actions
     if (newStatus === 'CANCELLED' && !window.confirm("Are you sure you want to CANCEL this shipment?")) {
        return;
     }

     try {
       // Call the patch endpoint we created earlier
       await api.patch(`/shipments/${shipmentId}/status`, { status: newStatus });
       // Refresh the list to show new status
       fetchShipments(currentPage); 
     } catch (err) {
       alert("Failed to update status. " + (err.response?.data?.message || ""));
     }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground uppercase">
            {isDriver ? "My Logistics Log" : "Logistics Command"}
          </h1>
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
            {isDriver ? "Assignment History & Status" : "Global Shipment Manifest"}
          </p>
        </div>
        <div className="flex gap-2">
            <Button variant="tactical" size="sm" onClick={() => fetchShipments(currentPage)}>
                <RefreshCw className="w-4 h-4 mr-2" />
                SYNC
            </Button>
            
            {!isDriver && (
              <Button variant="default" size="sm" onClick={() => setIsCreateModalOpen(true)}>
                  <PackagePlus className="w-4 h-4 mr-2" />
                  NEW SHIPMENT
              </Button>
            )}
        </div>
      </div>

      {/* Content */}
      {(loading && shipments.length === 0) ? (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed border-border rounded-sm">
            <Loader className="h-8 w-8 animate-spin text-primary mb-4" />
            <span className="text-xs font-mono uppercase text-muted-foreground">Accessing Logistics Database...</span>
        </div>
      ) : error ? (
        <div className="p-4 border border-destructive/50 bg-destructive/10 text-destructive text-xs font-mono uppercase">
           Error: {error}
        </div>
      ) : (
        <>
          <ShipmentsTable 
              shipments={shipments} 
              isDriver={isDriver} 
              onStatusUpdate={handleStatusUpdate} // <--- Pass the function here
          />
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

      {!isDriver && (
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="INITIATE NEW SHIPMENT"
        >
          <CreateShipmentForm
            onSuccess={handleCreateShipment}
            onCancel={() => setIsCreateModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
}

export default ShipmentsPage;