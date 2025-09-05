import React, { useState, useEffect } from 'react';
import api from '../services/api';

const ExpenseForm = ({ onSave, onCancel, submitting }) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'MAINTENANCE',
    expenseDate: new Date().toISOString().split('T')[0],
    truckId: '',
  });
  const [trucks, setTrucks] = useState([]);

  useEffect(() => {
    // Fetch trucks for the dropdown if the category is MAINTENANCE
    if (formData.category === 'MAINTENANCE') {
      const fetchTrucks = async () => {
        try {
          const response = await api.get('/trucks?size=200'); // Fetch all trucks
          setTrucks(response.data.content);
        } catch (error) {
          console.error("Failed to fetch trucks", error);
        }
      };
      fetchTrucks();
    }
  }, [formData.category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
        ...formData,
        amount: parseFloat(formData.amount),
        truckId: formData.truckId ? parseInt(formData.truckId, 10) : null,
    };
    // Do not send truckId if category is not MAINTENANCE
    if (payload.category !== 'MAINTENANCE') {
        delete payload.truckId;
    }
    onSave(payload);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
          <input name="description" type="text" required value={formData.description} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount ($)</label>
                <input name="amount" type="number" step="0.01" required value={formData.amount} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
                <input name="expenseDate" type="date" required value={formData.expenseDate} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
            </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
          <select name="category" value={formData.category} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white">
            <option value="MAINTENANCE">Maintenance</option>
            <option value="FUEL">Fuel</option>
            <option value="SALARIES">Salaries</option>
            <option value="INSURANCE">Insurance</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
        
        {/* Conditional Truck Dropdown */}
        {formData.category === 'MAINTENANCE' && (
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Truck (Required for Maintenance)</label>
                <select name="truckId" value={formData.truckId} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                    <option value="">Select a Truck</option>
                    {trucks.map(truck => (
                        <option key={truck.id} value={truck.id}>
                            {truck.licensePlate} ({truck.make} {truck.model})
                        </option>
                    ))}
                </select>
            </div>
        )}
      </div>
      <div className="mt-6 flex justify-end space-x-3">
        <button type="button" onClick={onCancel} className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500">
          Cancel
        </button>
        <button type="submit" disabled={submitting} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
          {submitting ? 'Saving...' : 'Save Expense'}
        </button>
      </div>
    </form>
  );
};

export default ExpenseForm;