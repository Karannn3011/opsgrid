import React from "react";
import { Edit, Trash2, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const TrucksTable = ({ trucks, onEdit, onDelete }) => {
  if (!trucks || trucks.length === 0) {
    return (
      <div className="p-8 text-center border border-dashed border-border rounded-sm">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Fleet Registry Empty
        </h3>
        <p className="mt-1 text-xs font-mono text-muted-foreground">
          Initialize fleet by adding your first unit.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-secondary/50 text-xs uppercase text-muted-foreground font-mono">
            <tr>
              <th className="px-4 py-3 font-medium border-b border-border tracking-wider">Unit ID / Plate</th>
              <th className="px-4 py-3 font-medium border-b border-border tracking-wider">Configuration</th>
              <th className="px-4 py-3 font-medium border-b border-border tracking-wider">Model Year</th>
              <th className="px-4 py-3 font-medium border-b border-border tracking-wider">Capacity</th>
              <th className="px-4 py-3 font-medium border-b border-border tracking-wider">Status</th>
              <th className="px-4 py-3 font-medium border-b border-border tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {trucks.map((truck) => (
              <tr key={truck.id} className="group hover:bg-secondary/20 transition-colors">
                <td className="px-4 py-3 font-mono font-medium text-foreground">
                  {truck.licensePlate}
                  <div className="text-[10px] text-muted-foreground">ID: #{truck.id}</div>
                </td>
                <td className="px-4 py-3 font-mono uppercase text-xs">
                  {truck.make} <span className="text-muted-foreground">/</span> {truck.model}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                  {truck.year}
                </td>
                <td className="px-4 py-3 font-mono text-xs">
                  {truck.capacityKg?.toLocaleString()} <span className="text-[10px] text-muted-foreground">KG</span>
                </td>
                <td className="px-4 py-3">
                   <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm border text-[10px] font-bold uppercase tracking-wide
                     ${truck.status === 'WORKING' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 
                       truck.status === 'IN_REPAIR' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' : 
                       'bg-slate-500/10 text-slate-600 border-slate-500/20'}`}>
                     
                     {truck.status === 'WORKING' && <CheckCircle className="w-3 h-3" />}
                     {truck.status === 'IN_REPAIR' && <AlertTriangle className="w-3 h-3" />}
                     {truck.status === 'OUT_OF_SERVICE' && <Clock className="w-3 h-3" />}
                     
                     {truck.status === 'WORKING' ? 'OPERATIONAL' : 
                      truck.status === 'IN_REPAIR' ? 'MAINTENANCE' : 'IDLE'}
                   </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-7 w-7 rounded-sm" 
                        onClick={() => onEdit(truck)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-7 w-7 rounded-sm text-destructive hover:bg-destructive hover:text-white"
                        onClick={() => onDelete(truck.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TrucksTable;