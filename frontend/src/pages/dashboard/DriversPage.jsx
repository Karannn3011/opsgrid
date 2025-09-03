import React, { useState, useEffect, useCallback } from "react";
import api from "../../services/api";
import DriversTable from "../../components/DriversTable";
import Modal from "../../components/common/Modal";
import DriverForm from "../../components/DriverForm";
import PaginationControls from "../../components/common/PaginationControls"; // Import Pagination

function DriversPage() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const PAGE_SIZE = 10;

  // Modal State
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
      setError("Failed to fetch drivers.");
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
    fetchDrivers(currentPage);
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
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Driver Management
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Create and manage your company's driver profiles.
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white shadow-sm hover:bg-blue-700"
        >
          Create Driver Profile
        </button>
      </div>

      {loading && <p>Loading drivers...</p>}
      {error && (
        <p className="rounded-md bg-red-100 p-4 text-center text-red-700">
          {error}
        </p>
      )}

      {!loading && !error && (
        <>
          <DriversTable drivers={drivers} onEdit={handleEditClick} />
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {/* Modals are unchanged but their handlers are updated */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Driver Profile"
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
          title={`Edit Profile: ${editingDriver.fullName}`}
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
