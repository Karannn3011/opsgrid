import React, { useState, useEffect, useCallback } from "react";
import api, { putWithTextBody } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import ShipmentsTable from "../../components/ShipmentsTable";
import Modal from "../../components/common/Modal";
import CreateShipmentForm from "../../components/CreateShipmentForm";
import PaginationControls from "../../components/common/PaginationControls"; // Import

function ShipmentsPage() {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const PAGE_SIZE = 10;

  const { user } = useAuth();
  const isManagerOrAdmin =
    user?.roles?.includes("ROLE_ADMIN") ||
    user?.roles?.includes("ROLE_MANAGER");

  const fetchShipments = useCallback(
    async (page) => {
      const endpoint = isManagerOrAdmin
        ? "/shipments"
        : "/shipments/my-shipments";
      try {
        setLoading(true);
        const response = await api.get(
          `${endpoint}?page=${page}&size=${PAGE_SIZE}&sort=createdAt,desc`,
        );
        const pageData = response.data;
        setShipments(pageData.content);
        setTotalPages(pageData.totalPages);
        setCurrentPage(pageData.number);
        setError(null);
      } catch (err) {
        setError("Failed to fetch shipments.");
      } finally {
        setLoading(false);
      }
    },
    [isManagerOrAdmin],
  );

  useEffect(() => {
    fetchShipments(currentPage);
  }, [fetchShipments, currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleShipmentCreated = (newShipment) => {
    // Go to the first page to see the new shipment
    if (currentPage === 0) {
      fetchShipments(0);
    } else {
      setCurrentPage(0);
    }
    setIsModalOpen(false);
  };

  const handleUpdateStatus = async (shipmentId, newStatus) => {
    try {
      const response = await putWithTextBody(
        `/shipments/${shipmentId}/status`,
        newStatus,
      );
      setShipments((prev) =>
        prev.map((s) => (s.id === shipmentId ? response.data : s)),
      );
    } catch (err) {
      setError("Failed to update status.");
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Shipment Management</h1>
          <p className="mt-1 text-gray-600">
            {isManagerOrAdmin
              ? "Create and monitor all company shipments."
              : "View and update your assigned shipments."}
          </p>
        </div>
        {isManagerOrAdmin && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white"
          >
            Create Shipment
          </button>
        )}
      </div>

      {loading && <p>Loading shipments...</p>}
      {error && (
        <p className="rounded-md bg-red-100 p-4 text-center text-red-700">
          {error}
        </p>
      )}

      {!loading && !error && (
        <>
          <ShipmentsTable
            shipments={shipments}
            onUpdateStatus={handleUpdateStatus}
          />
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Shipment"
      >
        <CreateShipmentForm
          onShipmentCreated={handleShipmentCreated}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}

export default ShipmentsPage;
