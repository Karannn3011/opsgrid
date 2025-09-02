import React, { useState } from "react";
import Modal from "../../components/common/Modal";
import InviteUserForm from "../../components/InviteUserForm";

function UsersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inviteStatus, setInviteStatus] = useState("");

  const handleUserInvited = () => {
    setIsModalOpen(false);
    setInviteStatus(
      "Invitation sent successfully! The user will receive an email shortly.",
    );
    // Clear the message after a few seconds
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

      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Company Users
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          A list of all users in your company will be displayed here.
        </p>
      </div>

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
