import React from 'react';
import { Wrench, Calendar, DollarSign } from 'lucide-react';

const MaintenanceTable = ({ history, loading }) => {
  if (loading) return null; // Parent handles loading spinner usually

  if (!history || history.length === 0) {
    return (
      <div className="p-8 text-center border border-dashed border-border rounded-sm">
        <p className="text-xs font-mono text-muted-foreground uppercase">
          No service history records found.
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

  return (
    <div className="border border-border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-secondary/50 text-xs uppercase text-muted-foreground font-mono">
            <tr>
              <th className="px-4 py-3 font-medium border-b border-border tracking-wider">Service Date</th>
              <th className="px-4 py-3 font-medium border-b border-border tracking-wider">Description</th>
              <th className="px-4 py-3 font-medium border-b border-border tracking-wider text-right">Cost</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {history.map((record) => (
              <tr key={record.id} className="group hover:bg-secondary/20 transition-colors">
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                   <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      {formatDate(record.expenseDate)}
                   </div>
                </td>
                <td className="px-4 py-3">
                   <div className="flex items-center gap-2">
                      <Wrench className="w-3 h-3 text-muted-foreground/50" />
                      <span className="font-mono text-xs uppercase text-foreground">
                         {record.description}
                      </span>
                   </div>
                </td>
                <td className="px-4 py-3 text-right">
                   <span className="font-mono font-bold text-foreground">
                      {formatCurrency(record.amount)}
                   </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MaintenanceTable;