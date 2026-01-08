import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ExpenseForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    amount: '',
    category: 'MAINTENANCE', // Default
    description: '',
    expenseDate: new Date().toISOString().split('T')[0] // Today
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    // Convert string amount to number
    const payload = {
        ...formData,
        amount: parseFloat(formData.amount)
    };
    await onSubmit(payload);
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
            <div>
               <label className="block text-xs font-mono font-medium uppercase text-muted-foreground mb-1">
                 Date of Expense
               </label>
               <Input 
                 name="expenseDate" 
                 type="date"
                 required 
                 value={formData.expenseDate} 
                 onChange={handleChange} 
                 className="font-mono"
               />
            </div>
            <div>
               <label className="block text-xs font-mono font-medium uppercase text-muted-foreground mb-1">
                 Total Amount ($)
               </label>
               <Input 
                 name="amount" 
                 type="number"
                 step="0.01"
                 required 
                 value={formData.amount} 
                 onChange={handleChange} 
                 placeholder="0.00"
                 className="font-mono"
               />
            </div>
        </div>

        <div>
           <label className="block text-xs font-mono font-medium uppercase text-muted-foreground mb-1">
             Cost Category
           </label>
           <select 
               name="category" 
               value={formData.category} 
               onChange={handleChange} 
               className="flex h-9 w-full rounded-sm border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring font-mono uppercase"
           >
               <option value="MAINTENANCE">Maintenance & Repair</option>
               <option value="FUEL">Fuel / Energy</option>
               <option value="TOLL">Tolls & Permits</option>
               <option value="SALARY">Payroll / Salary</option>
               <option value="MISC">Miscellaneous</option>
           </select>
        </div>

        <div>
           <label className="block text-xs font-mono font-medium uppercase text-muted-foreground mb-1">
             Description / Reference
           </label>
           <Input 
             name="description" 
             required 
             value={formData.description} 
             onChange={handleChange} 
             placeholder="e.g. OIL CHANGE TRUCK #402"
             className="font-mono uppercase"
           />
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
          {submitting ? 'Logging...' : 'Confirm Entry'}
        </Button>
      </div>
    </form>
  );
};

export default ExpenseForm;