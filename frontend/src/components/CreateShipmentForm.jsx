import React, { useState, useEffect } from "react";
import api from "../services/api";

const CreateShipmentForm = ({ onShipmentCreated, onCancel }) => {
  const [formData, setFormData] = useState({
    description: "",
    origin: "",
    destination: "",
    assignedDriverId: "",
    assignedTruckId: "",
  });

  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [availableTrucks, setAvailableTrucks] = useState([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isTruckSelectionDisabled, setIsTruckSelectionDisabled] =
    useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [driversRes, trucksRes] = await Promise.all([
          api.get('/drivers'),
          api.get('/trucks')
        ]);
        
        // 1. Handle Drivers (Paginated)
        // Access .content. If empty/undefined, fallback to []
        setAvailableDrivers(driversRes.data.content || []);

        // 2. Handle Trucks (Paginated)
        // Access .content BEFORE filtering
        const allTrucks = trucksRes.data.content || [];
        setAvailableTrucks(allTrucks.filter(t => t.status === 'WORKING'));
        
      } catch (err) {
        console.error(err); // Log the error to see details
        setError('Failed to load drivers and trucks.');
      }
    };
    fetchData();
  }, []);

  // ++ START: LOGIC FIX ++
  const handleDriverChange = (e) => {
    const driverId = e.target.value;
    const selectedDriver = availableDrivers.find((d) => d.userId === driverId);

    setFormData((prev) => ({
      ...prev,
      assignedDriverId: driverId,
      // If the selected driver has an assigned truck, auto-select it. Otherwise, clear the selection.
      assignedTruckId: selectedDriver?.assignedTruckId || "",
    }));

    // Disable the truck dropdown if the driver has a pre-assigned truck
    setIsTruckSelectionDisabled(!!selectedDriver?.assignedTruckId);
  };
  // ++ END: LOGIC FIX ++

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        assignedTruckId: parseInt(formData.assignedTruckId, 10),
      };
      const response = await api.post("/shipments", payload);
      onShipmentCreated(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create shipment.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <p className="mb-4 rounded-md bg-red-100 p-3 text-center text-sm text-red-700">
          {error}
        </p>
      )}
      <div className="space-y-4">
        <input
          name="description"
          placeholder="Shipment Description"
          required
          onChange={handleChange}
          className="mt-1 block w-full rounded-md dark:bg-gray-700 dark:text-white"
        />
        <div className="grid grid-cols-2 gap-4">
          <input
            name="origin"
            placeholder="Origin"
            required
            onChange={handleChange}
            className="mt-1 block w-full rounded-md dark:bg-gray-700 dark:text-white"
          />
          <input
            name="destination"
            placeholder="Destination"
            required
            onChange={handleChange}
            className="mt-1 block w-full rounded-md dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Updated Driver Select with new onChange handler */}
        <select
          name="assignedDriverId"
          required
          onChange={handleDriverChange}
          value={formData.assignedDriverId}
          className="mt-1 block w-full rounded-md dark:bg-gray-700 dark:text-white"
        >
          <option value="">Assign a Driver</option>
          {availableDrivers.map((d) => (
            <option key={d.userId} value={d.userId}>
              {d.fullName}
            </option>
          ))}
        </select>

        {/* Updated Truck Select with disabled logic */}
        <select
          name="assignedTruckId"
          required
          onChange={handleChange}
          value={formData.assignedTruckId}
          disabled={isTruckSelectionDisabled}
          className="mt-1 block w-full rounded-md disabled:bg-gray-100 dark:bg-gray-700 dark:text-white dark:disabled:bg-gray-800 dark:disabled:text-gray-400"
        >
          <option value="">Assign a Truck</option>
          {availableTrucks.map((t) => (
            <option key={t.id} value={t.id}>
              {t.licensePlate} ({t.make})
            </option>
          ))}
        </select>
      </div>
      <div className="mt-6 flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md bg-gray-200 px-4 py-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
        >
          {submitting ? "Creating..." : "Create Shipment"}
        </button>
      </div>
    </form>
  );
};

export default CreateShipmentForm;
