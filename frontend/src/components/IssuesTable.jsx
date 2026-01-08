import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { Bot, AlertCircle, Truck, User, CheckCircle, ArrowUpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const IssuesTable = ({ issues, onUpdateStatus, onDiagnose, isDriver }) => {
  const { user } = useAuth();
  const isManagerOrAdmin = !isDriver;

  if (!issues || issues.length === 0) {
    return (
      <div className="p-8 text-center border border-dashed border-border rounded-sm">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          System Operational
        </h3>
        <p className="mt-1 text-xs font-mono text-muted-foreground">
          No active incidents reported at this time.
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
              <th className="px-4 py-3 font-medium border-b border-border tracking-wider">Issue / ID</th>
              <th className="px-4 py-3 font-medium border-b border-border tracking-wider">Affected Asset</th>
              <th className="px-4 py-3 font-medium border-b border-border tracking-wider">Reporter</th>
              <th className="px-4 py-3 font-medium border-b border-border tracking-wider">Priority</th>
              <th className="px-4 py-3 font-medium border-b border-border tracking-wider">Status</th>
              
              {/* UPDATED: Column header is now visible to EVERYONE */}
              <th className="px-4 py-3 font-medium border-b border-border tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {issues.map((issue) => (
              <tr key={issue.id} className="group hover:bg-secondary/20 transition-colors">
                <td className="px-4 py-3">
                    <div className="font-mono font-bold text-foreground flex items-center gap-2">
                        {issue.title}
                    </div>
                    <div className="text-[10px] text-muted-foreground font-mono mt-1">
                        ID: #{issue.id}
                    </div>
                </td>
                <td className="px-4 py-3 font-mono text-xs">
                    <div className="flex items-center gap-2">
                        <Truck className="w-3 h-3 text-muted-foreground" />
                        {issue.relatedTruckLicensePlate || "N/A"}
                    </div>
                </td>
                <td className="px-4 py-3 font-mono text-xs">
                    <div className="flex items-center gap-2">
                        <User className="w-3 h-3 text-muted-foreground" />
                        {issue.reportedByDriverName}
                    </div>
                </td>
                <td className="px-4 py-3">
                    <div className={`inline-flex items-center px-2 py-0.5 rounded-sm border text-[10px] font-bold uppercase tracking-wide
                        ${issue.priority === 'HIGH' ? 'bg-destructive/10 text-destructive border-destructive/20' : 
                          issue.priority === 'MEDIUM' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' : 
                          'bg-blue-500/10 text-blue-600 border-blue-500/20'}`}>
                        {issue.priority}
                    </div>
                </td>
                <td className="px-4 py-3">
                     <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm border text-[10px] font-bold uppercase tracking-wide
                        ${issue.status === 'RESOLVED' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 
                          issue.status === 'ESCALATED' ? 'bg-purple-500/10 text-purple-600 border-purple-500/20' : 
                          'bg-slate-500/10 text-slate-600 border-slate-500/20'}`}>
                        {issue.status === 'RESOLVED' && <CheckCircle className="w-3 h-3" />}
                        {issue.status === 'ESCALATED' && <ArrowUpCircle className="w-3 h-3" />}
                        {issue.status === 'OPEN' && <AlertCircle className="w-3 h-3" />}
                        {issue.status}
                    </div>
                </td>
                
                {/* UPDATED: Action cell is visible to EVERYONE */}
                <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                            {/* AI DIAGNOSE BUTTON (Visible to ALL) */}
                            <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-7 w-7 rounded-sm border-primary/20 text-primary hover:bg-primary hover:text-white"
                            title="Run AI Diagnostics"
                            onClick={() => onDiagnose(issue)}
                            >
                            <Bot className="w-3 h-3" />
                            </Button>

                            {/* STATUS ACTIONS (Visible ONLY to Managers/Admins) */}
                            {isManagerOrAdmin && issue.status === 'OPEN' && (
                            <>
                                <Button 
                                    size="sm"
                                    className="h-7 px-2 text-[10px] uppercase bg-emerald-600 hover:bg-emerald-700 text-white"
                                    onClick={() => onUpdateStatus(issue.id, "RESOLVED")}
                                >
                                    Resolve
                                </Button>
                                <Button 
                                    variant="outline"
                                    size="sm"
                                    className="h-7 px-2 text-[10px] uppercase border-purple-500/30 text-purple-600 hover:bg-purple-50"
                                    onClick={() => onUpdateStatus(issue.id, "ESCALATED")}
                                >
                                    Escalate
                                </Button>
                            </>
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

export default IssuesTable;