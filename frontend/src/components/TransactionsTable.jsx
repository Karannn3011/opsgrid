import React from 'react';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';

const TransactionsTable = ({ transactions }) => {
  if (!transactions || transactions.length === 0) {
    return <div className="p-8 text-center border border-dashed border-border rounded-sm text-xs font-mono text-muted-foreground uppercase">No transactions found.</div>;
  }

  const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <div className="border border-border bg-card overflow-hidden">
      <table className="w-full text-left text-sm">
        <thead className="bg-secondary/50 text-xs uppercase text-muted-foreground font-mono">
          <tr>
            <th className="px-4 py-3 font-medium border-b border-border">Date</th>
            <th className="px-4 py-3 font-medium border-b border-border">Type</th>
            <th className="px-4 py-3 font-medium border-b border-border">Description</th>
            <th className="px-4 py-3 font-medium border-b border-border text-right">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50">
          {transactions.map((txn, idx) => (
            <tr key={`${txn.type}-${txn.id}-${idx}`} className="group hover:bg-secondary/20">
              <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{formatDate(txn.date)}</td>
              <td className="px-4 py-3">
                 <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-sm border ${txn.type === 'INCOME' ? 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5' : 'text-destructive border-destructive/20 bg-destructive/5'}`}>
                    {txn.type === 'INCOME' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownLeft className="w-3 h-3" />}
                    {txn.type}
                 </span>
              </td>
              <td className="px-4 py-3 font-mono text-xs uppercase">{txn.description}</td>
              <td className={`px-4 py-3 text-right font-mono font-bold ${txn.type === 'INCOME' ? 'text-emerald-500' : 'text-destructive'}`}>
                 {txn.type === 'INCOME' ? '+' : '-'} {formatCurrency(txn.amount)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsTable;