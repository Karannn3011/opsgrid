import React, { useState, useEffect, useCallback } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";

// Components
import UsersTable from "../../components/UsersTable";
import InviteUserForm from "../../components/InviteUserForm";
import Modal from "../../components/common/Modal";
import PaginationControls from "../../components/common/PaginationControls";

// Icons & UI
import { Loader, UserPlus, RefreshCw, CheckCircle, X } from "lucide-react"; 
import { Button } from "@/components/ui/button";

function UsersPage() {
  const { user } = useAuth();
  const isAdmin = user?.roles?.includes('ROLE_ADMIN');
  
  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  useEffect(() => { document.title = "OpsGrid | User Administration"; }, []);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(""); 

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const PAGE_SIZE = 10;

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const fetchUsers = useCallback(async (page) => {
    try {
      setLoading(true);
      const response = await api.get(`/users?page=${page}&size=${PAGE_SIZE}&sort=createdAt,desc`);
      setUsers(response.data.content);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.number);
      setError(null);
    } catch (err) {
      setError("Secure connection failed. Unable to retrieve directory.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(currentPage); }, [fetchUsers, currentPage]);

  // --- Handlers ---

  const handleUserInvited = () => {
    setIsInviteModalOpen(false);
    setSuccessMessage("✓ Invitation Sent: Verification email dispatched to user.");
    setTimeout(() => setSuccessMessage(""), 5000);
    fetchUsers(0); 
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground uppercase">User Administration</h1>
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Access Control & Account Provisioning</p>
        </div>
        <div className="flex gap-2">
            <Button variant="tactical" size="sm" onClick={() => fetchUsers(currentPage)}>
                <RefreshCw className="w-4 h-4 mr-2" /> SYNC
            </Button>
            <Button variant="default" size="sm" onClick={() => setIsInviteModalOpen(true)}>
                <UserPlus className="w-4 h-4 mr-2" /> INVITE USER
            </Button>
        </div>
      </div>

      {/* Success Banner */}
      {successMessage && (
        <div className="flex items-center justify-between p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-sm animate-in slide-in-from-top-2">
            <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wide">{successMessage}</span>
            </div>
            <button onClick={() => setSuccessMessage("")} className="hover:text-emerald-800">
                <X className="w-4 h-4" />
            </button>
        </div>
      )}

      {(loading && users.length === 0) ? (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed border-border rounded-sm">
            <Loader className="h-8 w-8 animate-spin text-primary mb-4" />
            <span className="text-xs font-mono uppercase text-muted-foreground">Accessing User Directory...</span>
        </div>
      ) : error ? (
        <div className="p-4 border border-destructive/50 bg-destructive/10 text-destructive text-xs font-mono uppercase">
           System Error: {error}
        </div>
      ) : (
        <>
          <UsersTable users={users} />
          {totalPages > 1 && (
              <div className="mt-4">
                <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
              </div>
          )}
        </>
      )}

      <Modal isOpen={isInviteModalOpen} onClose={() => setIsInviteModalOpen(false)} title="PROVISION NEW ACCOUNT">
          <InviteUserForm onUserInvited={handleUserInvited} onCancel={() => setIsInviteModalOpen(false)} />
      </Modal>
    </div>
  );
}

export default UsersPage;