import React from 'react';

const IssueStatusBadge = ({ status }) => {
  const statusStyles = {
    OPEN: 'bg-blue-100 text-blue-800',
    RESOLVED: 'bg-green-100 text-green-800',
    ESCALATED: 'bg-red-100 text-red-800',
  };

  const style = statusStyles[status] || 'bg-gray-100 text-gray-800';

  return (
    <span className={`rounded-full px-2 py-1 text-xs font-semibold leading-5 ${style}`}>
      {status}
    </span>
  );
};

export default IssueStatusBadge;