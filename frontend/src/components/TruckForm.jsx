import React, { useState, useEffect } from 'react';

const TruckForm = ({ onSubmit, onCancel, initialData = null, submitting }) => {
  const [formData, setFormData] = useState({
    licensePlate: '',
    make: '',
    model: '',
    year: '',
    capacityKg: '',
    status: 'WORKING',
  });

  // If initialData is provided, it means we are in "edit" mode.
  // This effect will run once to populate the form with the truck's current data.
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
    // The parent component's onSubmit function will handle the API call
    onSubmit(formData); 
  };

  const formTitle = initialData ? 'Edit Truck' : 'Add New Truck';
  const submitButtonText = initialData ? (submitting ? 'Updating...' : 'Update Truck') : (submitting ? 'Adding...' : 'Add Truck');

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">License Plate</label>
          <input name="licensePlate" type="text" required value={formData.licensePlate} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Make</label>
            <input name="make" type="text" required value={formData.make} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Model</label>
            <input name="model" type="text" required value={formData.model} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
          </div>
        </div>
         <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Year</label>
              <input name="year" type="number" required value={formData.year} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Capacity (kg)</label>
              <input name="capacityKg" type="number" required value={formData.capacityKg} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
            </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
          <select name="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white">
            <option value="WORKING">Working</option>
            <option value="IN_REPAIR">In Repair</option>
            <option value="OUT_OF_SERVICE">Out of Service</option>
          </select>
        </div>
      </div>
      <div className="mt-6 flex justify-end space-x-3">
        <button type="button" onClick={onCancel} className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500">
          Cancel
        </button>
        <button type="submit" disabled={submitting} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
          {submitButtonText}
        </button>
      </div>
    </form>
  );
};

export default TruckForm;