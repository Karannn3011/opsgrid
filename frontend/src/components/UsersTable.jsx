import React from 'react';

const UsersTable = ({ users }) => {
  if (!users || users.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">No Users Found</h3>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Invite a new user to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">Username</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">Email</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">Role</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">Status</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">Employee ID</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
          {users.map((user) => (
            <tr key={user.id}>
              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{user.username}</td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">{user.email}</td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">{user.roleName.replace('ROLE_', '')}</td>
              <td className="whitespace-nowrap px-6 py-4 text-sm">
                <span className={`rounded-full px-2 py-1 text-xs font-semibold capitalize ${
                    user.status === 'ACTIVE' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                    {user.status.toLowerCase()}
                </span>
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">{user.employeeId}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;