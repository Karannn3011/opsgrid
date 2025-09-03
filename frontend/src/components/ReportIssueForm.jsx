import React, { useState, useEffect } from 'react';
import api from '../services/api';

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
          setError('You are not assigned to a truck. Please contact your manager.');
        }
      } catch (err) {
        setError('Could not load your driver profile.');
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
      setError(err.response?.data?.message || 'Failed to report issue.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p className="mb-4 rounded-md bg-red-100 p-3 text-center text-sm text-red-700">{error}</p>}
      <div className="space-y-4">
        <input name="title" placeholder="Issue Title (e.g., Flat Tyre)" required onChange={handleChange} className="w-full rounded-md dark:bg-gray-700" />
        <textarea name="description" placeholder="Describe the issue in detail..." rows="3" onChange={handleChange} className="w-full rounded-md dark:bg-gray-700"></textarea>
        <div className="grid grid-cols-2 gap-4">
          <select name="priority" value={formData.priority} onChange={handleChange} className="w-full rounded-md dark:bg-gray-700">
            <option value="HIGH">High Priority</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="LOW">Low Priority</option>
          </select>
          
          {/* This is now a disabled input showing the assigned truck */}
          <input 
            type="text" 
            disabled 
            value={assignedTruck ? `Truck: ${assignedTruck.licensePlate}` : 'No truck assigned'}
            className="w-full rounded-md bg-gray-100 dark:bg-gray-800 dark:text-gray-400"
          />
        </div>
      </div>
      <div className="mt-6 flex justify-end space-x-3">
        <button type="button" onClick={onCancel} className="rounded-md bg-gray-200 px-4 py-2">Cancel</button>
        <button type="submit" disabled={submitting || !assignedTruck} className="rounded-md bg-blue-600 px-4 py-2 text-white disabled:opacity-50">
          {submitting ? 'Submitting...' : 'Report Issue'}
        </button>
      </div>
    </form>
  );
};

export default ReportIssueForm;