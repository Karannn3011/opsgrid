import React from 'react';
import { Trash2, Wrench, Droplet, FileText, DollarSign } from 'lucide-react';
import { Button } from "@/components/ui/button";

const ExpensesTable = ({ expenses, onDelete }) => {
  if (!expenses || expenses.length === 0) {
    return (
      <div className="p-8 text-center border border-dashed border-border rounded-sm">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Ledger Empty
        </h3>
        <p className="mt-1 text-xs font-mono text-muted-foreground">
          No operational costs recorded.
        </p>
      </div>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'MAINTENANCE': return <Wrench className="w-3 h-3" />;
      case 'FUEL': return <Droplet className="w-3 h-3" />;
      default: return <FileText className="w-3 h-3" />;
    }
  };

  return (
    <div className="border border-border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-secondary/50 text-xs uppercase text-muted-foreground font-mono">
            <tr>
              <th className="px-4 py-3 font-medium border-b border-border tracking-wider">Date</th>
              <th className="px-4 py-3 font-medium border-b border-border tracking-wider">Category</th>
              <th className="px-4 py-3 font-medium border-b border-border tracking-wider">Details</th>
              <th className="px-4 py-3 font-medium border-b border-border tracking-wider text-right">Amount</th>
              <th className="px-4 py-3 font-medium border-b border-border tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {expenses.map((expense) => (
              <tr key={expense.id} className="group hover:bg-secondary/20 transition-colors">
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                  {formatDate(expense.expenseDate)}
                </td>
                <td className="px-4 py-3">
                   <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm border text-[10px] font-bold uppercase tracking-wide
                     ${expense.category === 'MAINTENANCE' ? 'bg-destructive/10 text-destructive border-destructive/20' : 
                       expense.category === 'FUEL' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' : 
                       'bg-slate-500/10 text-slate-600 border-slate-500/20'}`}>
                     {getCategoryIcon(expense.category)}
                     {expense.category}
                   </div>
                </td>
                <td className="px-4 py-3">
                  <span className="font-mono text-xs uppercase truncate max-w-[200px] block">
                    {expense.description}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="font-mono font-bold text-foreground">
                    {formatCurrency(expense.amount)}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-7 w-7 rounded-sm text-muted-foreground hover:bg-destructive hover:text-white opacity-0 group-hover:opacity-100 transition-opacity" 
                      onClick={() => onDelete(expense.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpensesTable;