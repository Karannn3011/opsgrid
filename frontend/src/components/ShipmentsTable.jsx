import React from 'react';
import { 
  Package, 
  MapPin, 
  Truck, 
  User, 
  CheckCircle, 
  Clock, 
  ArrowRight,
  Play,
  XCircle,
  Flag
} from 'lucide-react';
import { Button } from "@/components/ui/button";

const ShipmentsTable = ({ shipments, isDriver = false, onStatusUpdate }) => {
  if (!shipments || shipments.length === 0) {
    return (
      <div className="p-8 text-center border border-dashed border-border rounded-sm">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          No Logistics Records
        </h3>
        <p className="mt-1 text-xs font-mono text-muted-foreground">
          Manifest is currently empty.
        </p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="border border-border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-secondary/50 text-xs uppercase text-muted-foreground font-mono">
            <tr>
              <th className="px-4 py-3 font-medium border-b border-border tracking-wider">Shipment ID</th>
              <th className="px-4 py-3 font-medium border-b border-border tracking-wider">Route Vector</th>
              <th className="px-4 py-3 font-medium border-b border-border tracking-wider">Status</th>
              <th className="px-4 py-3 font-medium border-b border-border tracking-wider">Assigned Asset</th>
              {!isDriver && (
                <th className="px-4 py-3 font-medium border-b border-border tracking-wider">Operator</th>
              )}
              {/* Added Actions Column */}
              <th className="px-4 py-3 font-medium border-b border-border tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {shipments.map((shipment) => (
              <tr key={shipment.id} className="group hover:bg-secondary/20 transition-colors">
                <td className="px-4 py-3">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-sm bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                         <Package className="w-4 h-4" />
                      </div>
                      <div>
                         <div className="font-mono font-bold text-foreground">#{shipment.id}</div>
                         <div className="text-[10px] text-muted-foreground font-mono uppercase truncate max-w-[120px]">
                            {shipment.description}
                         </div>
                      </div>
                   </div>
                </td>
                <td className="px-4 py-3">
                   <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-xs font-mono uppercase">
                         <MapPin className="w-3 h-3 text-muted-foreground" />
                         {shipment.origin}
                      </div>
                      <div className="pl-1.5 border-l border-border/50 ml-1.5 my-0.5 h-2"></div>
                      <div className="flex items-center gap-2 text-xs font-mono uppercase text-foreground font-medium">
                         <ArrowRight className="w-3 h-3 text-primary" />
                         {shipment.destination}
                      </div>
                   </div>
                </td>
                <td className="px-4 py-3">
                   <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm border text-[10px] font-bold uppercase tracking-wide
                     ${shipment.status === 'DELIVERED' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 
                       shipment.status === 'IN_TRANSIT' ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' : 
                       shipment.status === 'PENDING' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' :
                       'bg-slate-500/10 text-slate-600 border-slate-500/20'}`}>
                     
                     {shipment.status === 'DELIVERED' && <CheckCircle className="w-3 h-3" />}
                     {shipment.status === 'IN_TRANSIT' && <Truck className="w-3 h-3" />}
                     {shipment.status === 'PENDING' && <Clock className="w-3 h-3" />}
                     
                     {shipment.status.replace('_', ' ')}
                   </div>
                </td>
                <td className="px-4 py-3 font-mono text-xs">
                   {shipment.assignedTruckLicensePlate ? (
                      <span className="text-foreground">{shipment.assignedTruckLicensePlate}</span>
                   ) : (
                      <span className="text-muted-foreground/50 italic">--</span>
                   )}
                </td>
                
                {!isDriver && (
                    <td className="px-4 py-3 font-mono text-xs">
                        {shipment.assignedDriverName ? (
                            <div className="flex items-center gap-1.5 text-foreground">
                                <User className="w-3 h-3 text-muted-foreground" />
                                {shipment.assignedDriverName}
                            </div>
                        ) : (
                            <span className="text-muted-foreground/50 italic">--</span>
                        )}
                    </td>
                )}
                
                {/* ACTIONS COLUMN */}
                <td className="px-4 py-3 text-right">
                   <div className="flex items-center justify-end gap-2">
                      
                      {/* DRIVER ACTIONS */}
                      {isDriver && shipment.status === 'PENDING' && (
                          <Button 
                             size="sm" 
                             className="h-7 px-2 text-[10px] uppercase gap-1"
                             onClick={() => onStatusUpdate(shipment.id, 'IN_TRANSIT')}
                          >
                             <Play className="w-3 h-3" /> Start Route
                          </Button>
                      )}

                      {isDriver && shipment.status === 'IN_TRANSIT' && (
                          <Button 
                             size="sm" 
                             className="h-7 px-2 text-[10px] uppercase gap-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                             onClick={() => onStatusUpdate(shipment.id, 'DELIVERED')}
                          >
                             <Flag className="w-3 h-3" /> Complete
                          </Button>
                      )}

                      {/* MANAGER ACTIONS (Cancel) */}
                      {!isDriver && (shipment.status === 'PENDING' || shipment.status === 'IN_TRANSIT') && (
                          <Button 
                             variant="outline"
                             size="sm" 
                             className="h-7 px-2 text-[10px] uppercase gap-1 text-destructive hover:bg-destructive hover:text-white border-destructive/30"
                             onClick={() => onStatusUpdate(shipment.id, 'CANCELLED')}
                          >
                             <XCircle className="w-3 h-3" /> Cancel
                          </Button>
                      )}

                      {/* Info if no actions available */}
                      {(shipment.status === 'DELIVERED' || shipment.status === 'CANCELLED') && (
                          <span className="text-[10px] font-mono text-muted-foreground">
                             {formatDate(shipment.completedAt || shipment.createdAt)}
                          </span>
                      )}
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

export default ShipmentsTable;