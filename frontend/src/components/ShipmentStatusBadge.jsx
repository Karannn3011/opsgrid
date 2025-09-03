import React from "react";

const ShipmentStatusBadge = ({ status }) => {
  const statusStyles = {
    PENDING: "bg-yellow-100 text-yellow-800",
    IN_TRANSIT: "bg-blue-100 text-blue-800",
    DELIVERED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
  };

  const style = statusStyles[status] || "bg-gray-100 text-gray-800";

  return (
    <span
      className={`rounded-full px-2 py-1 text-xs font-semibold leading-5 ${style}`}
    >
      {status.replace("_", " ")}
    </span>
  );
};

export default ShipmentStatusBadge;
