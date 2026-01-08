import React from 'react';
import { Edit, User, Phone, Hash, Truck } from 'lucide-react';
import { Button } from "@/components/ui/button";

const DriversTable = ({ drivers, onEdit }) => {
  if (!drivers || drivers.length === 0) {
    return (
      <div className="p-8 text-center border border-dashed border-border rounded-sm">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          No Personnel Records
        </h3>
        <p className="mt-1 text-xs font-mono text-muted-foreground">
          Create a profile to begin assignment.
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
              <th className="px-4 py-3 font-medium border-b border-border tracking-wider">Operator Identity</th>
              <th className="px-4 py-3 font-medium border-b border-border tracking-wider">License ID</th>
              <th className="px-4 py-3 font-medium border-b border-border tracking-wider">Contact</th>
              <th className="px-4 py-3 font-medium border-b border-border tracking-wider">Assigned Asset</th>
              <th className="px-4 py-3 font-medium border-b border-border tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {drivers.map((driver) => (
              <tr key={driver.userId} className="group hover:bg-secondary/20 transition-colors">
                <td className="px-4 py-3">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-sm bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                         <User className="w-4 h-4" />
                      </div>
                      <div>
                         <div className="font-mono font-medium text-foreground">{driver.fullName}</div>
                         <div className="text-[10px] text-muted-foreground font-mono uppercase">{driver.username}</div>
                      </div>
                   </div>
                </td>
                <td className="px-4 py-3 font-mono text-xs">
                   <div className="flex items-center gap-2">
                      <Hash className="w-3 h-3 text-muted-foreground" />
                      {driver.licenseNumber}
                   </div>
                </td>
                <td className="px-4 py-3 font-mono text-xs">
                   <div className="flex items-center gap-2">
                      <Phone className="w-3 h-3 text-muted-foreground" />
                      {driver.contactNumber}
                   </div>
                </td>
                <td className="px-4 py-3 font-mono text-xs">
                   {driver.assignedTruckLicensePlate ? (
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-secondary border border-border">
                         <Truck className="w-3 h-3" />
                         {driver.assignedTruckLicensePlate}
                      </div>
                   ) : (
                      <span className="text-muted-foreground/50 uppercase italic text-[10px]">Unassigned</span>
                   )}
                </td>
                <td className="px-4 py-3 text-right">
                  <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-7 w-7 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity" 
                      onClick={() => onEdit(driver)}
                  >
                    <Edit className="h-3 w-3" />
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

export default DriversTable;