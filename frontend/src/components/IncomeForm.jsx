import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const IncomeForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    incomeDate: new Date().toISOString().split('T')[0] // Today
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    // API expects BigDecimals/Doubles
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
                 Date Received
               </label>
               <Input 
                 name="incomeDate" 
                 type="date"
                 required 
                 value={formData.incomeDate} 
                 onChange={handleChange} 
                 className="font-mono"
               />
            </div>
            <div>
               <label className="block text-xs font-mono font-medium uppercase text-muted-foreground mb-1">
                 Amount Received ($)
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
             Source / Description
           </label>
           <Input 
             name="description" 
             required 
             value={formData.description} 
             onChange={handleChange} 
             placeholder="e.g. PAYMENT FOR SHIPMENT #1042"
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
            className="uppercase bg-emerald-600 hover:bg-emerald-700"
        >
          {submitting ? 'Recording...' : 'Record Income'}
        </Button>
      </div>
    </form>
  );
};

export default IncomeForm;