import React, { useState, useEffect } from "react";
import api from "../services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const DriverForm = ({ onSave, onCancel, initialData = null }) => {
  const [formData, setFormData] = useState({
    userId: "",
    fullName: "",
    licenseNumber: "",
    contactNumber: "",
    assignedTruckId: "",
  });

  const [availableUsers, setAvailableUsers] = useState([]);
  const [availableTrucks, setAvailableTrucks] = useState([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isEditMode = initialData !== null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const trucksRes = await api.get("/trucks?size=200");
        setAvailableTrucks(trucksRes.data.content);

        if (!isEditMode) {
          const usersRes = await api.get("/users/unprofiled-drivers");
          setAvailableUsers(usersRes.data);
        }
      } catch (err) {
        setError("System Error: Failed to retrieve auxiliary data.");
      }
    };
    fetchData();
  }, [isEditMode]);

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
      await onSave(payload);
    } catch (err) {
      setError(err.response?.data?.message || "Operation failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-xs font-mono uppercase">
          {error}
        </div>
      )}
      
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-mono font-medium uppercase text-muted-foreground mb-1">
            Associated User Account
          </label>
          {isEditMode ? (
            <Input
              disabled
              value={initialData.username}
              className="bg-secondary/50 text-muted-foreground font-mono"
            />
          ) : (
            <>
              <select
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                required
                className="flex h-9 w-full rounded-sm border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring font-mono"
              >
                <option value="">SELECT USER ACCOUNT</option>
                {availableUsers?.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.username} ({user.email})
                  </option>
                ))}
              </select>
              {availableUsers.length === 0 && (
                <p className="mt-1 text-[10px] text-destructive uppercase">
                  Alert: No unassigned driver accounts available. Invite new user first.
                </p>
              )}
            </>
          )}
        </div>

        <div>
          <label className="block text-xs font-mono font-medium uppercase text-muted-foreground mb-1">
            Full Legal Name
          </label>
          <Input
            name="fullName"
            required
            value={formData.fullName}
            onChange={handleChange}
            placeholder="ENTER FULL NAME"
            className="font-mono uppercase"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono font-medium uppercase text-muted-foreground mb-1">
              License ID
            </label>
            <Input
              name="licenseNumber"
              required
              value={formData.licenseNumber}
              onChange={handleChange}
              placeholder="LIC-XXXX-XXXX"
              className="font-mono uppercase"
            />
          </div>
          <div>
            <label className="block text-xs font-mono font-medium uppercase text-muted-foreground mb-1">
              Contact #
            </label>
            <Input
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              placeholder="+XX XXX XXX XXXX"
              className="font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono font-medium uppercase text-muted-foreground mb-1">
            Assign Vehicle Asset
          </label>
          <select
            name="assignedTruckId"
            value={formData.assignedTruckId}
            onChange={handleChange}
            className="flex h-9 w-full rounded-sm border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring font-mono"
          >
            <option value="">NO ASSET ASSIGNED</option>
            {availableTrucks.map((truck) => (
              <option key={truck.id} value={truck.id}>
                {truck.licensePlate} ({truck.make} {truck.model})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-border">
        <Button 
            type="button" 
            variant="ghost" 
            onClick={onCancel}
            className="uppercase"
        >
          Cancel
        </Button>
        <Button 
            type="submit" 
            disabled={submitting || (!isEditMode && availableUsers.length === 0)}
            className="uppercase"
        >
          {isEditMode ? (submitting ? "Saving..." : "Save Profile") : (submitting ? "Creating..." : "Create Profile")}
        </Button>
      </div>
    </form>
  );
};

export default DriverForm;