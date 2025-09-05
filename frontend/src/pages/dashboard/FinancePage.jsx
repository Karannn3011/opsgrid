import React, { useState, useEffect, useCallback, useMemo } from 'react';
import api from '../../services/api';
import ExpensesTable from '../../components/ExpensesTable';
import IncomesTable from '../../components/IncomesTable';
import AllFinancesTable from '../../components/AllFinancesTable'; // Import new table
import PaginationControls from '../../components/common/PaginationControls';
import Modal from '../../components/common/Modal';
import ExpenseForm from '../../components/ExpenseForm';
import IncomeForm from '../../components/IncomeForm';

function FinancePage() {
    const [activeTab, setActiveTab] = useState('expenses');
    const [expenses, setExpenses] = useState([]);
    const [incomes, setIncomes] = useState([]);
    const [allFinances, setAllFinances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const PAGE_SIZE = 10;
    
    // Modal and Form State
    const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
    const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Sorting State
    const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'descending' });

    const fetchData = useCallback(async (page) => {
        setLoading(true);
        setError(null);
        try {
            if (activeTab === 'all') {
                const [expensesRes, incomesRes] = await Promise.all([
                    api.get(`/finance/expenses?size=100&sort=expenseDate,desc`),
                    api.get(`/finance/incomes?size=100&sort=incomeDate,desc`)
                ]);

                const formattedExpenses = expensesRes.data.content.map(e => ({...e, type: 'expense', date: e.expenseDate}));
                const formattedIncomes = incomesRes.data.content.map(i => ({...i, type: 'income', date: i.incomeDate}));
                
                setAllFinances([...formattedExpenses, ...formattedIncomes]);
                // Pagination is disabled for the 'all' tab in this simple implementation
                setTotalPages(1); 
                setCurrentPage(0);

            } else {
                const endpoint = activeTab === 'expenses' ? '/finance/expenses' : '/finance/incomes';
                const sortKey = activeTab === 'expenses' ? 'expenseDate' : 'incomeDate';
                const response = await api.get(`${endpoint}?page=${page}&size=${PAGE_SIZE}&sort=${sortKey},desc`);
                const pageData = response.data;

                if (activeTab === 'expenses') {
                    setExpenses(pageData.content);
                } else {
                    setIncomes(pageData.content);
                }
                setTotalPages(pageData.totalPages);
                setCurrentPage(pageData.number);
            }
        } catch (err) {
            setError(`Failed to fetch ${activeTab}. Please try again.`);
        } finally {
            setLoading(false);
        }
    }, [activeTab]);

    useEffect(() => {
        fetchData(0); 
    }, [fetchData]);

    const sortedAllFinances = useMemo(() => {
        let sortableItems = [...allFinances];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [allFinances, sortConfig]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            fetchData(newPage);
        }
    };
    
    const handleSave = async (type, formData) => {
        setSubmitting(true);
        try {
            const endpoint = type === 'expense' ? '/finance/expenses' : '/finance/incomes';
            await api.post(endpoint, formData);
            
            setIsExpenseModalOpen(false);
            setIsIncomeModalOpen(false);
            fetchData(0); 
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

    const tabClass = (tabName) => 
        `px-4 py-2 text-sm font-medium rounded-md ${
        activeTab === tabName 
        ? 'bg-blue-600 text-white' 
        : 'text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700'
        }`;

    return (
        <div>
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
                <button className={tabClass('expenses')} onClick={() => setActiveTab('expenses')}>Expenses</button>
                <button className={tabClass('incomes')} onClick={() => setActiveTab('incomes')}>Incomes</button>
                <button className={tabClass('all')} onClick={() => setActiveTab('all')}>All Finances</button>
            </div>

            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500 text-center p-4">{error}</p>}

            {!loading && !error && (
                <div>
                    {activeTab === 'expenses' && <ExpensesTable expenses={expenses} onDelete={(id) => handleDelete('expense', id)} />}
                    {activeTab === 'incomes' && <IncomesTable incomes={incomes} onDelete={(id) => handleDelete('income', id)} />}
                    {activeTab === 'all' && <AllFinancesTable items={sortedAllFinances} requestSort={requestSort} sortConfig={sortConfig} />}
                    
                    {activeTab !== 'all' && (
                        <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                    )}
                </div>
            )}
            
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