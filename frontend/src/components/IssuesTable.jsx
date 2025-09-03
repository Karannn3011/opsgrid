import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import IssueStatusBadge from './IssueStatusBadge';
import IssuePriorityBadge from './IssuePriorityBadge';

const IssuesTable = ({ issues, onUpdateStatus }) => {
    const { user } = useAuth();
    const isManagerOrAdmin = user?.roles?.includes('ROLE_ADMIN') || user?.roles?.includes('ROLE_MANAGER');

  if (!issues || issues.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">No Issues Found</h3>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          This is great! There are currently no open issues.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Title</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Truck</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Reported By</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Priority</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
          {issues.map((issue) => (
            <tr key={issue.id}>
              <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{issue.title}</td>
              <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">{issue.relatedTruckLicensePlate}</td>
              <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">{issue.reportedByDriverName}</td>
              <td className="px-6 py-4 text-sm"><IssuePriorityBadge priority={issue.priority} /></td>
              <td className="px-6 py-4 text-sm"><IssueStatusBadge status={issue.status} /></td>
              <td className="px-6 py-4 text-sm">
                {isManagerOrAdmin && issue.status === 'OPEN' && (
                  <select
                    onChange={(e) => onUpdateStatus(issue.id, e.target.value)}
                    defaultValue=""
                    className="rounded-md border-gray-300 text-sm shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="" disabled>Update Status</option>
                    <option value="RESOLVED">Resolved</option>
                    <option value="ESCALATED">Escalated</option>
                  </select>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default IssuesTable;