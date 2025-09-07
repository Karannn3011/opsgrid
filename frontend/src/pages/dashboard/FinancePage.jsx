import React, { useState, useEffect, useCallback, useMemo } from 'react';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import ExpensesTable from '../../components/ExpensesTable';
import IncomesTable from '../../components/IncomesTable';
import AllFinancesTable from '../../components/AllFinancesTable';
import PaginationControls from '../../components/common/PaginationControls';
import Modal from '../../components/common/Modal';
import ExpenseForm from '../../components/ExpenseForm';
import IncomeForm from '../../components/IncomeForm';
import AIAnalysis from '../../components/AIAnalysis';
import {Loader} from "lucide-react"

function FinancePage() {
    const { user } = useAuth();
    const isAdmin = user?.roles?.includes('ROLE_ADMIN');

    const [activeTab, setActiveTab] = useState('expenses');
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const PAGE_SIZE = 10;
    
    const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
    const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    
    // This is no longer used for API calls, but kept for the client-side sorted table
    const [sortConfig, setSortConfig] = useState(null); 

    const fetchData = useCallback(async (page) => {
        setLoading(true);
        setError(null);
        let endpoint = `/finance/${activeTab}`;
        
        // --- START OF FIX ---
        // Determine the correct sort property based on the active tab
        let sortProperty = 'date'; // Default for 'all' tab
        if (activeTab === 'expenses') {
            sortProperty = 'expenseDate';
        } else if (activeTab === 'incomes') {
            sortProperty = 'incomeDate';
        }
        // --- END OF FIX ---

        try {
            // Use the correct sortProperty in the API call
            const response = await api.get(`${endpoint}?page=${page}&size=${PAGE_SIZE}&sort=${sortProperty},desc`);
            const pageData = response.data;
            
            setItems(pageData.content);
            setTotalPages(pageData.totalPages);
            setCurrentPage(pageData.number);
        } catch (err) {
            setError(`Failed to fetch ${activeTab}. Please try again.`);
            setTotalPages(0);
        } finally {
            setLoading(false);
        }
    }, [activeTab]);

    useEffect(() => {
        fetchData(currentPage); 
    }, [fetchData, currentPage]);

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setCurrentPage(newPage);
        }
    };
    
    const handleSave = async (type, formData) => {
        setSubmitting(true);
        try {
            const endpoint = type === 'expense' ? '/finance/expenses' : '/finance/incomes';
            await api.post(endpoint, formData);
            
            setIsExpenseModalOpen(false);
            setIsIncomeModalOpen(false);
            if (currentPage === 0) {
                fetchData(0);
            } else {
                setCurrentPage(0);
            }
        } catch (err) {
            console.error(`Failed to save ${type}`, err);
        } finally {
            setSubmitting(false);
        }
    };
    
    const handleDelete = async (type, id) => {
        if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
            try {
                const endpoint = type === 'expense' ? `/finance/expenses/${id}` : `/finance/incomes/${id}`;
                await api.delete(endpoint);
                fetchData(currentPage);
            } catch (err) {
                setError(`Failed to delete ${type}.`);
            }
        }
    };

    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
        setCurrentPage(0);
    }

    const tabClass = (tabName) => 
        `px-4 py-2 text-sm font-medium rounded-md ${
        activeTab === tabName 
        ? 'bg-blue-600 text-white' 
        : 'text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700'
        }`;

    return (
        <div>
            {/* The rest of the component remains the same */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">Finance Management</h1>
                    <p className="mt-1 text-gray-600">Track your company's incomes and expenses.</p>
                </div>
                <div>
                     <button onClick={() => activeTab === 'incomes' ? setIsIncomeModalOpen(true) : setIsExpenseModalOpen(true)} className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white">
                        {activeTab === 'incomes' ? 'Add Income' : 'Add Expense'}
                    </button>
                </div>
            </div>

            <div className="mb-6 flex space-x-2 border-b border-gray-200 dark:border-gray-700">
                <button className={tabClass('expenses')} onClick={() => handleTabClick('expenses')}>Expenses</button>
                <button className={tabClass('incomes')} onClick={() => handleTabClick('incomes')}>Incomes</button>
                <button className={tabClass('all')} onClick={() => handleTabClick('all')}>All Finances</button>
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
                <div>
                    {activeTab === 'expenses' && <ExpensesTable expenses={items} onDelete={(id) => handleDelete('expense', id)} />}
                    {activeTab === 'incomes' && <IncomesTable incomes={items} onDelete={(id) => handleDelete('income', id)} />}
                    {activeTab === 'all' && <AllFinancesTable items={items} />}
                    
                    {totalPages > 1 && (
                        <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                    )}
                </div>
            )}
            
            {isAdmin && <AIAnalysis />}
            
            <Modal isOpen={isExpenseModalOpen} onClose={() => setIsExpenseModalOpen(false)} title="Add New Expense">
                <ExpenseForm onSave={(data) => handleSave('expense', data)} onCancel={() => setIsExpenseModalOpen(false)} submitting={submitting} />
            </Modal>
            
            <Modal isOpen={isIncomeModalOpen} onClose={() => setIsIncomeModalOpen(false)} title="Add New Income">
                <IncomeForm onSave={(data) => handleSave('income', data)} onCancel={() => setIsIncomeModalOpen(false)} submitting={submitting} />
            </Modal>
        </div>
    );
}

export default FinancePage;