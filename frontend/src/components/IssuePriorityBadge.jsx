import React from "react";

const IssuePriorityBadge = ({ priority }) => {
  const priorityStyles = {
    HIGH: "border-red-500 text-red-500",
    MEDIUM: "border-yellow-500 text-yellow-500",
    LOW: "border-green-500 text-green-500",
  };

  const style = priorityStyles[priority] || "border-gray-500 text-gray-500";

  return (
    <span
      className={`rounded-md border px-2 py-0.5 text-xs font-medium ${style}`}
    >
      {priority}
    </span>
  );
};

export default IssuePriorityBadge;
