import React, { useState, useEffect } from 'react';
import api from "../services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const CreateShipmentForm = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    description: '',
    origin: '',
    destination: '',
    assignedDriverId: '',
    assignedTruckId: ''
  });

  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [availableTrucks, setAvailableTrucks] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch dropdown data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [driversRes, trucksRes] = await Promise.all([
          api.get('/drivers?size=100'), // Get list
          api.get('/trucks?size=100')
        ]);
        
        // Handle pagination content wrapper
        setAvailableDrivers(driversRes.data.content || []);
        
        // Filter only working trucks
        const allTrucks = trucksRes.data.content || [];
        setAvailableTrucks(allTrucks.filter(t => t.status === 'WORKING'));
        
      } catch (err) {
        setError('Failed to load fleet resources.');
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/shipments', formData);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to initialize shipment.');
    } finally {
      setLoading(false);
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
             Manifest Description
           </label>
           <Input 
             name="description" 
             required 
             value={formData.description} 
             onChange={handleChange} 
             placeholder="CARGO CONTENTS / REF ID"
             className="font-mono uppercase"
           />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono font-medium uppercase text-muted-foreground mb-1">
              Origin Point
            </label>
            <Input 
              name="origin" 
              required 
              value={formData.origin} 
              onChange={handleChange} 
              placeholder="CITY, REGION"
              className="font-mono uppercase"
            />
          </div>
          <div>
            <label className="block text-xs font-mono font-medium uppercase text-muted-foreground mb-1">
              Destination Point
            </label>
            <Input 
              name="destination" 
              required 
              value={formData.destination} 
              onChange={handleChange} 
              placeholder="CITY, REGION"
              className="font-mono uppercase"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div>
             <label className="block text-xs font-mono font-medium uppercase text-muted-foreground mb-1">
               Assign Operator
             </label>
             <select
                name="assignedDriverId"
                value={formData.assignedDriverId}
                onChange={handleChange}
                required
                className="flex h-9 w-full rounded-sm border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring font-mono"
             >
                <option value="">SELECT DRIVER</option>
                {availableDrivers.map(d => (
                  <option key={d.userId} value={d.userId}>{d.fullName}</option>
                ))}
             </select>
           </div>
           <div>
             <label className="block text-xs font-mono font-medium uppercase text-muted-foreground mb-1">
               Assign Vehicle
             </label>
             <select
                name="assignedTruckId"
                value={formData.assignedTruckId}
                onChange={handleChange}
                required
                className="flex h-9 w-full rounded-sm border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring font-mono"
             >
                <option value="">SELECT VEHICLE</option>
                {availableTrucks.map(t => (
                  <option key={t.id} value={t.id}>{t.licensePlate} ({t.model})</option>
                ))}
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
            disabled={loading}
            className="uppercase"
        >
          {loading ? "INITIALIZING..." : "CONFIRM SHIPMENT"}
        </Button>
      </div>
    </form>
  );
};

export default CreateShipmentForm;