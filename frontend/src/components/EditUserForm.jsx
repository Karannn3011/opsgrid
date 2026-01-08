import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const EditUserForm = ({ user, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    username: user.username || '',
    email: user.email || '',
    roleId: user.role?.id || (user.roles?.includes('ROLE_ADMIN') ? 1 : user.roles?.includes('ROLE_MANAGER') ? 2 : 3),
    status: user.status || 'ACTIVE'
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Prepare payload - Assuming backend handles mapping roleId to Role
    const payload = {
        username: formData.username,
        email: formData.email,
        status: formData.status,
        // Depending on backend, you might need to send 'role' name or 'roleId'
        // For now sending both logic based on previous patterns
        roleId: parseInt(formData.roleId), 
    };

    await onSubmit(payload);
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {/* Read Only Identity Fields */}
        <div className="grid grid-cols-2 gap-4">
            <div>
               <label className="block text-xs font-mono font-medium uppercase text-muted-foreground mb-1">
                 Username
               </label>
               <Input 
                 name="username" 
                 value={formData.username} 
                 disabled
                 className="font-mono bg-secondary/50"
               />
            </div>
            <div>
               <label className="block text-xs font-mono font-medium uppercase text-muted-foreground mb-1">
                 Email Address
               </label>
               <Input 
                 name="email" 
                 value={formData.email} 
                 onChange={handleChange}
                 className="font-mono"
               />
            </div>
        </div>

        {/* Editable Access Fields */}
        <div className="grid grid-cols-2 gap-4">
            <div>
            <label className="block text-xs font-mono font-medium uppercase text-muted-foreground mb-1">
                Access Level
            </label>
            <select 
                name="roleId" 
                value={formData.roleId} 
                onChange={handleChange} 
                className="flex h-9 w-full rounded-sm border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring font-mono uppercase"
            >
                <option value="1">Administrator</option>
                <option value="2">Manager</option>
                <option value="3">Driver</option>
            </select>
            </div>
            
            <div>
            <label className="block text-xs font-mono font-medium uppercase text-muted-foreground mb-1">
                Account Status
            </label>
            <select 
                name="status" 
                value={formData.status} 
                onChange={handleChange} 
                className="flex h-9 w-full rounded-sm border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring font-mono uppercase"
            >
                <option value="ACTIVE">Active</option>
                <option value="SUSPENDED">Suspended</option>
                <option value="INACTIVE">Inactive</option>
            </select>
            </div>
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
          {submitting ? 'Updating...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
};

export default EditUserForm;