import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import ShipmentStatusChart from '../../components/charts/ShipmentStatusChart';
import FleetStatusChart from '../../components/charts/FleetStatusChart'; // Import the new chart

function DashboardHomePage() {
  const [shipmentSummary, setShipmentSummary] = useState([]);
  const [truckSummary, setTruckSummary] = useState([]); // State for new chart data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Use Promise.all to fetch both datasets in parallel
        const [shipmentRes, truckRes] = await Promise.all([
          api.get('/analytics/shipment-summary'),
          api.get('/analytics/truck-summary')
        ]);
        setShipmentSummary(shipmentRes.data);
        setTruckSummary(truckRes.data);
      } catch (err) {
        setError('Could not load dashboard data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold">Dashboard Overview</h1>
      <p className="mt-1 text-gray-600">A quick summary of your company's logistics operations.</p>
      
      {loading && <p className="mt-6 text-center">Loading dashboard...</p>}
      {error && <p className="mt-6 text-center text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Shipment Chart */}
          <div className="rounded-lg border bg-white p-4 shadow-md lg:col-span-2">
            <h2 className="text-lg font-semibold">Shipment Status</h2>
            <div className="mt-4 h-80">
              <ShipmentStatusChart summaryData={shipmentSummary} />
            </div>
          </div>
          
          {/* Fleet Status Chart */}
          <div className="rounded-lg border bg-white p-4 shadow-md">
            <h2 className="text-lg font-semibold">Fleet Readiness</h2>
            <div className="mt-4 h-80">
              <FleetStatusChart summaryData={truckSummary} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardHomePage;