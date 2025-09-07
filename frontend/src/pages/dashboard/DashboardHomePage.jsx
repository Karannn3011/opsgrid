import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import ShipmentStatusChart from '../../components/charts/ShipmentStatusChart';
import FleetStatusChart from '../../components/charts/FleetStatusChart'; // Import the new chart
import {Loader} from "lucide-react"

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
      
     {(loading || error) && (
    <div className="absolute flex top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 justify-center items-center p-8">
        {loading ? (
            <div className="flex flex-col items-center gap-2">
                <Loader className="h-8 w-8 mx-auto animate-spin text-blue-600 scale-130" />
            </div>
        ) : error ? (
            <p className="rounded-md bg-red-100 p-4 text-center text-red-700">
                {error}
            </p>
        ) : null}
    </div>
)}

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