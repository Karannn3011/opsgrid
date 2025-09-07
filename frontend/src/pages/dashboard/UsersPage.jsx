import React, { useState, useEffect, useCallback } from "react";
import api from "../../services/api";
import Modal from "../../components/common/Modal";
import InviteUserForm from "../../components/InviteUserForm";
import UsersTable from "../../components/UsersTable";
import PaginationControls from "../../components/common/PaginationControls";
import {Loader} from "lucide-react"

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const PAGE_SIZE = 10;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inviteStatus, setInviteStatus] = useState("");

  const fetchUsers = useCallback(async (page) => {
    try {
      setLoading(true);
      const response = await api.get(`/users?page=${page}&size=${PAGE_SIZE}&sort=createdAt,desc`);
      const pageData = response.data;
      setUsers(pageData.content);
      setTotalPages(pageData.totalPages);
      setCurrentPage(pageData.number);
    } catch (err) {
      setError("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers(currentPage);
  }, [fetchUsers, currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleUserInvited = () => {
    setIsModalOpen(false);
    setInviteStatus("Invitation sent successfully! The user will receive an email shortly.");
    // Refresh the user list, going back to page 1
    if (currentPage === 0) {
        fetchUsers(0);
    } else {
        setCurrentPage(0);
    }
    setTimeout(() => setInviteStatus(""), 5000);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
            User Management
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Invite and manage users for your company.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white shadow-sm hover:bg-blue-700"
        >
          Invite User
        </button>
      </div>

      {inviteStatus && (
        <div className="mb-4 rounded-md bg-green-100 p-4 text-green-700">
          {inviteStatus}
        </div>
      )}

      {(loading || error) && (
    <div className="absolute flex top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 justify-center items-center p-8">
        {loading ? (
            <div className="flex flex-col items-center gap-2">
                <Loader className="h-8 w-8 mx-auto animate-spin text-blue-600 scale-130" />
            </div>
        ) : error ? (
            <p className="rounded-md bg-red-100 p-4 text-center text-red-700">
                {error}
            </p>
        ) : null}
    </div>
)}
      
      {!loading && !error && (
        <>
          <UsersTable users={users} />
          {totalPages > 1 && (
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Invite New User"
      >
        <InviteUserForm
          onUserInvited={handleUserInvited}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}

export default UsersPage;