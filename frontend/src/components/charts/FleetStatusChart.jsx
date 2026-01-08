import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function FleetStatusChart({ data }) {
  // We use state to store the colors so they update if the theme changes
  const [colors, setColors] = useState({
    primary: '#000000',
    muted: '#e5e7eb',
    background: '#ffffff'
  });

  useEffect(() => {
    const root = getComputedStyle(document.documentElement);
    // Helper to read OKLCH values and convert to roughly usable hex/rgb if needed 
    // or just use the exact values if ChartJS supports them. 
    // For safety with ChartJS, we'll grab the hex values if your variables are hex, 
    // OR we can just map the specific variable names if you are using the CSS I provided.
    // Since our CSS uses OKLCH, let's hardcode the "Tactical" palette for the chart 
    // to ensure it looks perfect, or use the tailwind classes mapping.
    
    setColors({
      active: 'oklch(0.60 0.18 45)', // Safety Orange
      inactive: 'oklch(0.88 0 0)',   // Concrete Gray
      maintenance: 'oklch(0.55 0.20 25)', // Alarm Red
      text: 'oklch(0.30 0.02 260)',
    });
  }, []);

  const chartData = {
    labels: ['Active', 'Maintenance', 'Idle'],
    datasets: [
      {
        data: [data?.active || 0, data?.maintenance || 0, data?.idle || 0],
        backgroundColor: [
          colors.active,      // Safety Orange
          colors.maintenance, // Alarm Red
          colors.inactive,    // Concrete
        ],
        borderColor: 'transparent',
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    cutout: '75%', // Thinner technical ring
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          pointStyle: 'rect', // Square legends
          font: {
            family: "'JetBrains Mono', monospace", // Technical font
            size: 10,
          },
          color: colors.text,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.9)',
        titleFont: { family: "'JetBrains Mono', monospace" },
        bodyFont: { family: "'JetBrains Mono', monospace" },
        cornerRadius: 0, // Sharp corners
        displayColors: false,
      }
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="h-[200px] w-full flex items-center justify-center relative">
       {/* Center Text for Data Density */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-3xl font-mono font-bold tracking-tighter text-foreground">
          {data?.total || 0}
        </span>
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
          Total Units
        </span>
      </div>
      <Doughnut data={chartData} options={options} />
    </div>
  );
}