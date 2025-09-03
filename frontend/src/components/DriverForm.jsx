import React, { useState, useEffect } from "react";
import api from "../services/api";

const DriverForm = ({ onSave, onCancel, initialData = null }) => {
  const [formData, setFormData] = useState({
    userId: "",
    fullName: "",
    licenseNumber: "",
    contactNumber: "",
    assignedTruckId: "",
  });

  // State for dropdown options
  const [availableUsers, setAvailableUsers] = useState([]);
  const [availableTrucks, setAvailableTrucks] = useState([]);

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isEditMode = initialData !== null;

  // Fetch data for dropdowns (users for create, trucks for both)
  useEffect(() => {
    const fetchData = async () => {
      try {
        // ++ START: LOGIC FIX ++
        // The /trucks endpoint is now paginated. We need to get the 'content' array.
        // We'll request a large size to get all trucks for the dropdown.
        const trucksRes = await api.get("/trucks?size=200"); // Request up to 200 trucks
        setAvailableTrucks(trucksRes.data.content); // Use the .content property
        // ++ END: LOGIC FIX ++

        // Only fetch unprofiled users if we are in "create" mode
        if (!isEditMode) {
          const usersRes = await api.get("/users/unprofiled-drivers");
          setAvailableUsers(usersRes.data);
        }
      } catch (err) {
        setError("Failed to load necessary data for the form.");
      }
    };
    fetchData();
  }, [isEditMode]);

  // Populate form if in edit mode
  useEffect(() => {
    if (isEditMode) {
      setFormData({
        userId: initialData.userId || "",
        fullName: initialData.fullName || "",
        licenseNumber: initialData.licenseNumber || "",
        contactNumber: initialData.contactNumber || "",
        assignedTruckId: initialData.assignedTruckId || "",
      });
    }
  }, [initialData, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        assignedTruckId: formData.assignedTruckId
          ? parseInt(formData.assignedTruckId, 10)
          : null,
      };
      await onSave(payload); // Parent component handles the API call
    } catch (err) {
      setError(err.response?.data?.message || "Operation failed.");
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
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            User
          </label>
          {isEditMode ? (
            <input
              type="text"
              disabled
              value={initialData.username}
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400"
            />
          ) : (
            <>
              <select
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select a User</option>
                {availableUsers?.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.username} ({user.email})
                  </option>
                ))}
              </select>
              {availableUsers.length === 0 && (
                <p className="mt-1 text-xs text-gray-500">
                  No available driver users. Please invite a new user with the
                  'Driver' role first.
                </p>
              )}
            </>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Full Name
          </label>
          <input
            name="fullName"
            type="text"
            required
            value={formData.fullName}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              License Number
            </label>
            <input
              name="licenseNumber"
              type="text"
              required
              value={formData.licenseNumber}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Contact Number
            </label>
            <input
              name="contactNumber"
              type="text"
              value={formData.contactNumber}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Assign Truck (Optional)
          </label>
          <select
            name="assignedTruckId"
            value={formData.assignedTruckId}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="">No Truck Assigned</option>
            {availableTrucks.length != 0 ? (
              availableTrucks.map((truck) => (
                <option key={truck.id} value={truck.id}>
                  {truck.licensePlate} ({truck.make} {truck.model})
                </option>
              ))
            ) : (
              <></>
            )}
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
          disabled={submitting || (!isEditMode && availableUsers.length === 0)}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isEditMode
            ? submitting
              ? "Saving..."
              : "Save Changes"
            : submitting
              ? "Creating..."
              : "Create Profile"}
        </button>
      </div>
    </form>
  );
};

export default DriverForm;
