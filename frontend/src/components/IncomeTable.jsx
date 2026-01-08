import React from 'react';
import { Trash2, TrendingUp } from 'lucide-react';
import { Button } from "@/components/ui/button";

const IncomeTable = ({ incomes, onDelete }) => {
  if (!incomes || incomes.length === 0) {
    return (
      <div className="p-8 text-center border border-dashed border-border rounded-sm">
        <p className="text-xs font-mono text-muted-foreground uppercase">
          No revenue records found.
        </p>
      </div>
    );
  }

  const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <div className="border border-border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-emerald-500/10 text-xs uppercase text-emerald-600 font-mono">
            <tr>
              <th className="px-4 py-3 font-medium border-b border-border tracking-wider">Date</th>
              <th className="px-4 py-3 font-medium border-b border-border tracking-wider">Source</th>
              <th className="px-4 py-3 font-medium border-b border-border tracking-wider text-right">Credit</th>
              <th className="px-4 py-3 font-medium border-b border-border tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {incomes.map((income) => (
              <tr key={income.id} className="group hover:bg-secondary/20 transition-colors">
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{formatDate(income.incomeDate)}</td>
                <td className="px-4 py-3 font-mono text-xs uppercase">{income.description}</td>
                <td className="px-4 py-3 text-right font-mono font-bold text-emerald-500">
                   + {formatCurrency(income.amount)}
                </td>
                <td className="px-4 py-3 text-right">
                  <Button variant="outline" size="icon" className="h-7 w-7 rounded-sm hover:bg-destructive hover:text-white opacity-0 group-hover:opacity-100" onClick={() => onDelete(income.id)}>
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

export default IncomeTable;