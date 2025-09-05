import React, { useState, useEffect } from "react";
import api from "../services/api";

const IncomeForm = ({ onSave, onCancel, submitting }) => {
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    incomeDate: new Date().toISOString().split("T")[0], // Default to today
    shipmentId: "",
  });
  const [shipments, setShipments] = useState([]);

  useEffect(() => {
    // Fetch delivered shipments to associate income with
    const fetchCompletedShipments = async () => {
      try {
        // Fetching all shipments for simplicity, can be optimized to fetch only 'DELIVERED'
        const response = await api.get(
          "/shipments?size=200&sort=createdAt,desc",
        );
        setShipments(response.data.content);
      } catch (error) {
        console.error("Failed to fetch shipments for income form", error);
      }
    };
    fetchCompletedShipments();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      amount: parseFloat(formData.amount),
      shipmentId: formData.shipmentId
        ? parseInt(formData.shipmentId, 10)
        : null,
    };
    onSave(payload);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Description
          </label>
          <input
            name="description"
            type="text"
            required
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Amount ($)
            </label>
            <input
              name="amount"
              type="number"
              step="0.01"
              required
              value={formData.amount}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Date
            </label>
            <input
              name="incomeDate"
              type="date"
              required
              value={formData.incomeDate}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Related Shipment (Optional)
          </label>
          <select
            name="shipmentId"
            value={formData.shipmentId}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="">No Associated Shipment</option>
            {shipments.map((shipment) => (
              <option key={shipment.id} value={shipment.id}>
                ID: {shipment.id} - {shipment.description}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-6 flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? "Saving..." : "Save Income"}
        </button>
      </div>
    </form>
  );
};

export default IncomeForm;
