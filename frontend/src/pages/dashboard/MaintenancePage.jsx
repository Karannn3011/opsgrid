import React, { useState, useEffect, useCallback } from "react";
import api from "../../services/api";
import MaintenanceLogTable from "../../components/MaintenanceLogTable";
import PaginationControls from "../../components/common/PaginationControls";
import {Loader} from "lucide-react"

function MaintenancePage() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTruckId, setSelectedTruckId] = useState("");
    const [trucks, setTrucks] = useState([]);

    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const PAGE_SIZE = 10;

    useEffect(() => {
        const fetchTrucks = async () => {
            try {
                const response = await api.get("/trucks?size=200");
                setTrucks(response.data.content);
            } catch (err) {
                console.error("Failed to fetch trucks for filter", err);
            }
        };
        fetchTrucks();
    }, []);

    const fetchLogs = useCallback(async (page) => {
        if (!selectedTruckId) {
            setLogs([]);
            setTotalPages(0);
            setLoading(false);
            return;
        }
        
        try {
            setLoading(true);
            const response = await api.get(`/maintenance-logs/truck/${selectedTruckId}?page=${page}&size=${PAGE_SIZE}&sort=serviceDate,desc`);
            const pageData = response.data;
            setLogs(pageData.content);
            setTotalPages(pageData.totalPages);
            setCurrentPage(pageData.number);
            setError(null);
        } catch (err) {
            setError('Failed to fetch maintenance logs.');
            setTotalPages(0); // Ensure totalPages is 0 on error
        } finally {
            setLoading(false);
        }
    }, [selectedTruckId]);

    // This useEffect handles all data fetching logic
    useEffect(() => {
        // When the selected truck changes, reset to page 0 and fetch
        setCurrentPage(0);
        fetchLogs(0);
    }, [selectedTruckId]);

    useEffect(() => {
        // When the currentPage changes, fetch the new page's data
        fetchLogs(currentPage);
    }, [currentPage, fetchLogs]);
    
    // This function ONLY updates the state
    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-semibold">Maintenance Logs</h1>
                <p className="mt-1 text-gray-600">View maintenance history for each truck.</p>
            </div>

            <div className="mb-6 max-w-xs">
                <label htmlFor="truckFilter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Select a Truck to View Logs
                </label>
                <select
                    id="truckFilter"
                    value={selectedTruckId}
                    onChange={(e) => setSelectedTruckId(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                    <option value="">-- Select a Truck --</option>
                    {trucks.map(truck => (
                        <option key={truck.id} value={truck.id}>
                            {truck.licensePlate} ({truck.make} {truck.model})
                        </option>
                    ))}
                </select>
            </div>
            
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
                <>
                    <MaintenanceLogTable logs={logs} />
                    {totalPages > 1 && (
                        <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                    )}
                </>
            )}
        </div>
    );
}

export default MaintenancePage;