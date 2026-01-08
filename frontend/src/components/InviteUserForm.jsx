import React, { useState } from "react";
import api from "../services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-xs font-mono uppercase">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-mono font-medium uppercase text-muted-foreground mb-1">
            Username
          </label>
          <Input
            name="username"
            type="text"
            required
            onChange={handleChange}
            className="font-mono"
            placeholder="JSMITH"
          />
        </div>

        <div>
          <label className="block text-xs font-mono font-medium uppercase text-muted-foreground mb-1">
            Email
          </label>
          <Input
            name="email"
            type="email"
            required
            onChange={handleChange}
            className="font-mono"
            placeholder="user@opsgrid.com"
          />
        </div>

        <div>
          <label className="block text-xs font-mono font-medium uppercase text-muted-foreground mb-1">
            Employee ID
          </label>
          <Input
            name="employeeId"
            type="text"
            required
            onChange={handleChange}
            className="font-mono uppercase"
            placeholder="EMP-XXXX"
          />
        </div>

        <div>
          <label className="block text-xs font-mono font-medium uppercase text-muted-foreground mb-1">
            Role Assignment
          </label>
          <select
            name="roleId"
            value={formData.roleId}
            onChange={handleChange}
            className="flex h-9 w-full rounded-sm border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring font-mono uppercase"
          >
            {/* Added Admin Option (ID: 1) */}
            <option value="1">Administrator</option>
            <option value="2">Manager</option>
            <option value="3">Driver</option>
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
            disabled={submitting}
            className="uppercase"
        >
          {submitting ? "Sending..." : "Send Invitation"}
        </Button>
      </div>
    </form>
  );
};

export default InviteUserForm;