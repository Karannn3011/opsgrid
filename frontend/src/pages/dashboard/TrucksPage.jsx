import React, { useState, useEffect, useCallback } from "react";
import {Loader} from "lucide-react"
import api from "../../services/api";
import TrucksTable from "../../components/TrucksTable";
import Modal from "../../components/common/Modal";
import TruckForm from "../../components/TruckForm";
import PaginationControls from "../../components/common/PaginationControls"; // Import Pagination

function TrucksPage() {
  useEffect(() => {
      document.title = "OpsGrid | Trucks"
    }, [])
  const [trucks, setTrucks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // New state for pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const PAGE_SIZE = 10; // Or any number you prefer

  // State for modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTruck, setEditingTruck] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchTrucks = useCallback(async (page) => {
    try {
      setLoading(true);
      // Pass pagination params to the API call
      const response = await api.get(
        `/trucks?page=${page}&size=${PAGE_SIZE}&sort=createdAt,desc`,
      );
      const pageData = response.data;

      setTrucks(pageData.content);
      setTotalPages(pageData.totalPages);
      setTotalElements(pageData.totalElements);
      setCurrentPage(pageData.number);
      setError(null);
    } catch (err) {
      setError("Failed to fetch trucks. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrucks(currentPage);
  }, [fetchTrucks, currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const refreshCurrentPage = () => {
    fetchTrucks(currentPage);
  };

  const handleAddTruck = async (formData) => {
    setSubmitting(true);
    setError("");
    try {
      const payload = {
        ...formData,
        year: parseInt(formData.year, 10),
        capacityKg: parseInt(formData.capacityKg, 10),
      };
      const response = await api.post("/trucks", payload);
      setTrucks((prevTrucks) => [...prevTrucks, response.data]);
      setIsAddModalOpen(false);
      refreshCurrentPage();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add truck.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditClick = (truck) => {
    setEditingTruck(truck);
    setIsEditModalOpen(true);
  };

  const handleUpdateTruck = async (formData) => {
    if (!editingTruck) return;
    setSubmitting(true);
    setError("");
    try {
      const payload = {
        ...formData,
        year: parseInt(formData.year, 10),
        capacityKg: parseInt(formData.capacityKg, 10),
      };
      const response = await api.put(`/trucks/${editingTruck.id}`, payload);
      setTrucks((prevTrucks) =>
        prevTrucks.map((t) => (t.id === editingTruck.id ? response.data : t)),
      );
      setIsEditModalOpen(false);
      setEditingTruck(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update truck.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (truckId) => {
    if (window.confirm("Are you sure you want to delete this truck?")) {
      try {
        await api.delete(`/trucks/${truckId}`);
        setTrucks((prevTrucks) => prevTrucks.filter((t) => t.id !== truckId));
      } catch (err) {
        setError("Failed to delete truck.");
      }
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Truck Management
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            View, add, and manage your company's fleet.
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white shadow-sm hover:bg-blue-700"
        >
          Add Truck
        </button>
      </div>

      {/* Spinner and Error Handling Block */}
{(loading || error) && (
    <div className="absolute flex top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 justify-center items-center p-8">
        {loading ? (
            <div className="flex flex-col items-center gap-2">
                <Loader className="h-8 w-8 mx-auto animate-spin text-blue-600 scale-130" />
            </div>
        ) : error ? (
            <p className="rounded-md bg-red-100 p-4 text-center text-red-700">
                {error}
            </p>
        ) : null}
    </div>
)}
      {!loading && !error && (
        <>
          <TrucksTable
            trucks={trucks}
            onEdit={handleEditClick}
            onDelete={handleDelete}
          />
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {/* Add Truck Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Truck"
      >
        <TruckForm
          onSubmit={handleAddTruck}
          onCancel={() => setIsAddModalOpen(false)}
          submitting={submitting}
        />
      </Modal>

      {/* Edit Truck Modal */}
      {editingTruck && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Edit Truck"
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
