import React from "react";
import ShipmentStatusBadge from "./ShipmentStatusBadge";
import { useAuth } from "../contexts/AuthContext";

const ShipmentsTable = ({ shipments, onUpdateStatus }) => {
  const { user } = useAuth();
  const isDriver = user?.roles?.includes("ROLE_DRIVER");

  if (!shipments || shipments.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
          No Shipments Found
        </h3>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {isDriver
            ? "You have no assigned shipments."
            : "Create a new shipment to get started."}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-300">
              Description
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-300">
              Origin → Destination
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-300">
              Driver & Truck
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-300">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-300">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
          {shipments.map((shipment) => (
            <tr key={shipment.id}>
              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                {shipment.description}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                {shipment.origin} → {shipment.destination}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                <div>{shipment.assignedDriverName}</div>
                <div className="text-xs text-gray-400">
                  {shipment.assignedTruckLicensePlate}
                </div>
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm">
                <ShipmentStatusBadge status={shipment.status} />
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm">
                {isDriver &&
                  (shipment.status === "PENDING" ||
                    shipment.status === "IN_TRANSIT") && (
                    <select
                      onChange={(e) =>
                        onUpdateStatus(shipment.id, e.target.value)
                      }
                      defaultValue=""
                      className="rounded-md border-gray-300 text-sm shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="" disabled>
                        Update Status
                      </option>
                      {shipment.status === "PENDING" && (
                        <option value="IN_TRANSIT">In Transit</option>
                      )}
                      {shipment.status === "IN_TRANSIT" && (
                        <option value="DELIVERED">Delivered</option>
                      )}
                    </select>
                  )}
                {!isDriver && (
                  <span className="text-xs text-gray-400">
                    Driver updates status
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShipmentsTable;
