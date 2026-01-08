import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"; // Use your UI button
import { Input } from "@/components/ui/input";   // Use your UI input

const TruckForm = ({ onSubmit, onCancel, initialData = null, submitting }) => {
  const [formData, setFormData] = useState({
    licensePlate: '',
    make: '',
    model: '',
    year: '',
    capacityKg: '',
    status: 'WORKING',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        licensePlate: initialData.licensePlate || '',
        make: initialData.make || '',
        model: initialData.model || '',
        year: initialData.year || '',
        capacityKg: initialData.capacityKg || '',
        status: initialData.status || 'WORKING',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); 
  };

  const submitButtonText = initialData ? (submitting ? 'Updating...' : 'Update Unit') : (submitting ? 'Registering...' : 'Register Unit');

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-xs font-mono font-medium uppercase text-muted-foreground mb-1">
             License Plate ID
          </label>
          <Input 
             name="licensePlate" 
             required 
             value={formData.licensePlate} 
             onChange={handleChange} 
             placeholder="e.g. KA-01-AB-1234"
             className="font-mono uppercase"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono font-medium uppercase text-muted-foreground mb-1">Make</label>
            <Input name="make" required value={formData.make} onChange={handleChange} placeholder="e.g. Volvo" />
          </div>
          <div>
            <label className="block text-xs font-mono font-medium uppercase text-muted-foreground mb-1">Model</label>
            <Input name="model" required value={formData.model} onChange={handleChange} placeholder="e.g. FH16" />
          </div>
        </div>

         <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-medium uppercase text-muted-foreground mb-1">Year</label>
              <Input name="year" type="number" required value={formData.year} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-xs font-mono font-medium uppercase text-muted-foreground mb-1">Capacity (KG)</label>
              <Input name="capacityKg" type="number" required value={formData.capacityKg} onChange={handleChange} />
            </div>
        </div>

        <div>
          <label className="block text-xs font-mono font-medium uppercase text-muted-foreground mb-1">Current Status</label>
          <select 
            name="status" 
            value={formData.status} 
            onChange={handleChange} 
            className="flex h-9 w-full rounded-sm border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring font-mono"
          >
            <option value="WORKING">Operational (Working)</option>
            <option value="IN_REPAIR">Maintenance (In Repair)</option>
            <option value="OUT_OF_SERVICE">Decommissioned (Idle)</option>
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
          {submitButtonText}
        </Button>
      </div>
    </form>
  );
};

export default TruckForm;