import React, { useState } from "react";
import api from "../services/api";

const InviteUserForm = ({ onUserInvited, onCancel }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    employeeId: "",
    roleId: "2", // Default to Manager (2)
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

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
        roleId: parseInt(formData.roleId, 10),
      };
      await api.post("/admin/users/invite", payload);
      onUserInvited(); // Notify parent component
    } catch (err) {
      setError(err.response?.data || "Failed to send invitation.");
      console.error(err);
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
            Username
          </label>
          <input
            name="username"
            type="text"
            required
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email
          </label>
          <input
            name="email"
            type="email"
            required
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Employee ID
          </label>
          <input
            name="employeeId"
            type="text"
            required
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Role
          </label>
          <select
            name="roleId"
            value={formData.roleId}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            {/* These IDs correspond to the data.sql seeding */}
            <option value="2">Manager</option>
            <option value="3">Driver</option>
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
          {submitting ? "Sending..." : "Send Invitation"}
        </button>
      </div>
    </form>
  );
};

export default InviteUserForm;
