import React from 'react';
import { 
  ShieldAlert, 
  Briefcase, 
  Truck, 
  UserCircle,
  Hash,
  Mail,
  Clock,
  CheckCircle2
} from 'lucide-react';

const UsersTable = ({ users }) => {
  if (!users || users.length === 0) {
    return (
      <div className="p-12 text-center border border-dashed border-border rounded-sm bg-secondary/5">
        <div className="flex justify-center mb-3">
            <UserCircle className="w-10 h-10 text-muted-foreground/50" />
        </div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Directory Offline
        </h3>
        <p className="mt-1 text-xs font-mono text-muted-foreground">
          No active personnel records found in the system.
        </p>
      </div>
    );
  }

  // Helper to determine role styling
  const getRoleBadge = (user) => {
    const roleName = user.role?.name || (user.roles && user.roles[0]) || 'USER';
    const roleUpper = roleName.toUpperCase();
    
    if (roleUpper.includes('ADMIN')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-sm border bg-red-500/10 text-red-600 border-red-500/20 text-[10px] font-bold uppercase tracking-wide">
          <ShieldAlert className="w-3 h-3" /> COMMAND (ADMIN)
        </span>
      );
    }
    if (roleUpper.includes('MANAGER')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-sm border bg-purple-500/10 text-purple-600 border-purple-500/20 text-[10px] font-bold uppercase tracking-wide">
          <Briefcase className="w-3 h-3" /> OFFICER (MGR)
        </span>
      );
    }
    // Default / Driver
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-sm border bg-blue-500/10 text-blue-600 border-blue-500/20 text-[10px] font-bold uppercase tracking-wide">
        <Truck className="w-3 h-3" /> OPERATOR (DRV)
      </span>
    );
  };

  return (
    <div className="border border-border bg-card shadow-sm rounded-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          {/* Tactical Header */}
          <thead className="bg-secondary/50 text-[10px] uppercase text-muted-foreground font-mono tracking-widest border-b border-border">
            <tr>
              <th className="px-4 py-3 font-medium">Personnel Identity</th>
              <th className="px-4 py-3 font-medium">Clearance Level</th>
              <th className="px-4 py-3 font-medium">Contact Channel</th>
              <th className="px-4 py-3 font-medium text-right">Account Status</th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-border/40">
            {users.map((user) => (
              <tr key={user.id} className="group hover:bg-secondary/30 transition-colors">
                
                {/* Identity Column */}
                <td className="px-4 py-3">
                   <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-sm bg-primary/5 border border-primary/20 flex items-center justify-center text-primary mt-0.5">
                         <span className="font-mono font-bold text-xs">
                             {user.username ? user.username.substring(0,2).toUpperCase() : "??"}
                         </span>
                      </div>
                      <div className="flex flex-col">
                         <span className="font-mono font-bold text-sm text-foreground">{user.username}</span>
                         <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-mono uppercase mt-0.5">
                            <Hash className="w-3 h-3" />
                            {user.employeeId || `SYS-${user.id}`}
                         </div>
                      </div>
                   </div>
                </td>

                {/* Role Column */}
                <td className="px-4 py-3">
                   {getRoleBadge(user)}
                </td>

                {/* Contact Column */}
                <td className="px-4 py-3">
                   <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                      <Mail className="w-3 h-3 opacity-50" />
                      {user.email}
                   </div>
                </td>

                {/* Status Column */}
                <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end">
                        {user.status === 'ACTIVE' ? (
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                                    Active
                                </span>
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">
                                    Pending
                                </span>
                                <Clock className="w-4 h-4 text-amber-500" />
                            </div>
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

export default UsersTable;