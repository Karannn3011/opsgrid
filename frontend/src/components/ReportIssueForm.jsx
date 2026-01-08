import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ReportIssueForm = ({ onIssueReported, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    relatedTruckId: '',
  });

  const [assignedTruck, setAssignedTruck] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Fetch the logged-in driver's profile to get their assigned truck
    const fetchMyProfile = async () => {
      try {
        const response = await api.get('/drivers/me');
        const driverProfile = response.data;
        
        if (driverProfile && driverProfile.assignedTruckId) {
          setAssignedTruck({
            id: driverProfile.assignedTruckId,
            licensePlate: driverProfile.assignedTruckLicensePlate,
          });
          // Pre-fill the form with the assigned truck's ID
          setFormData(prev => ({ ...prev, relatedTruckId: driverProfile.assignedTruckId }));
        } else {
          setError('CRITICAL: No vehicle assigned. Contact Dispatch immediately.');
        }
      } catch (err) {
        setError('System Error: Could not retrieve driver profile.');
      }
    };
    fetchMyProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        relatedTruckId: parseInt(formData.relatedTruckId, 10),
      };
      const response = await api.post('/issues', payload);
      onIssueReported(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed.');
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
             Incident Title
           </label>
           <Input 
             name="title" 
             required 
             value={formData.title} 
             onChange={handleChange} 
             placeholder="e.g. BRAKE FAILURE, ENGINE LIGHT"
             className="font-mono uppercase"
           />
        </div>

        <div>
           <label className="block text-xs font-mono font-medium uppercase text-muted-foreground mb-1">
             Affected Asset (Auto-Detected)
           </label>
           <Input 
              disabled 
              value={assignedTruck ? `UNIT #${assignedTruck.licensePlate} (ID: ${assignedTruck.id})` : 'NO ASSET DETECTED'}
              className="bg-secondary/50 text-muted-foreground font-mono"
           />
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-xs font-mono font-medium uppercase text-muted-foreground mb-1">
              Priority Level
            </label>
            <select 
                name="priority" 
                value={formData.priority} 
                onChange={handleChange} 
                className="flex h-9 w-full rounded-sm border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring font-mono uppercase"
            >
                <option value="HIGH">High (Immediate Action)</option>
                <option value="MEDIUM">Medium (Schedule Repair)</option>
                <option value="LOW">Low (Log for Later)</option>
            </select>
          </div>
        </div>

        <div>
           <label className="block text-xs font-mono font-medium uppercase text-muted-foreground mb-1">
             Detailed Description
           </label>
           <textarea 
             name="description" 
             required
             rows="4" 
             placeholder="Describe symptoms, noise, warning lights..." 
             onChange={handleChange} 
             className="flex min-h-[80px] w-full rounded-sm border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 font-mono"
           ></textarea>
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
            disabled={submitting || !assignedTruck}
            variant="destructive"
            className="uppercase"
        >
          {submitting ? 'Transmitting...' : 'Submit Report'}
        </Button>
      </div>
    </form>
  );
};

export default ReportIssueForm;