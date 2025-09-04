import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const ShipmentStatusChart = ({ summaryData }) => {
  const statusColors = {
    PENDING: "rgba(251, 191, 36, 0.8)", // Yellow
    IN_TRANSIT: "rgba(59, 130, 246, 0.8)", // Blue
    DELIVERED: "rgba(16, 185, 129, 0.8)", // Green
    CANCELLED: "rgba(239, 68, 68, 0.8)", // Red
  };

  const data = {
    labels: summaryData.map((d) => d.status.replace("_", " ")),
    datasets: [
      {
        label: "Shipments",
        data: summaryData.map((d) => d.count),
        backgroundColor: summaryData.map(
          (d) => statusColors[d.status] || "#ccc",
        ),
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: false,
        text: "Shipment Status Distribution",
      },
    },
  };

  return <Doughnut data={data} options={options} />;
};

export default ShipmentStatusChart;
