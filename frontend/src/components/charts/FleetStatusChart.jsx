import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const FleetStatusChart = ({ summaryData }) => {
  const statusColors = {
    WORKING: 'rgba(16, 185, 129, 0.8)',      // Green
    IN_REPAIR: 'rgba(251, 191, 36, 0.8)',   // Yellow
    OUT_OF_SERVICE: 'rgba(239, 68, 68, 0.8)', // Red
  };

  const data = {
    labels: summaryData.map(d => d.status.replace('_', ' ')),
    datasets: [
      {
        label: 'Trucks',
        data: summaryData.map(d => d.count),
        backgroundColor: summaryData.map(d => statusColors[d.status] || '#ccc'),
        borderColor: '#fff',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  return <Pie data={data} options={options} />;
};

export default FleetStatusChart;