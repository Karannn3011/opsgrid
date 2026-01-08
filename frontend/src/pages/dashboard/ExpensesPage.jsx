import React, { useState, useEffect, useCallback } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";

// Components
import ExpensesTable from "../../components/ExpensesTable";
import IncomeTable from "../../components/IncomeTable";
import TransactionsTable from "../../components/TransactionsTable";
import Modal from "../../components/common/Modal";
import ExpenseForm from "../../components/ExpenseForm";
import IncomeForm from "../../components/IncomeForm";
import PaginationControls from "../../components/common/PaginationControls";

// Icons & UI
import { Loader, Plus, RefreshCw, Layers, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";

function ExpensesPage() {
  const { user } = useAuth();

  // Security Check
  if (user?.roles?.includes('ROLE_DRIVER')) return <Navigate to="/dashboard" replace />;

  useEffect(() => { document.title = "OpsGrid | Financial Ledger"; }, []);

  // --- State ---
  const [activeTab, setActiveTab] = useState("ALL"); // ALL | INCOME | EXPENSE
  
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [allTransactions, setAllTransactions] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const PAGE_SIZE = 15; // Larger page size for ledger

  // Modals
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);

  // --- Fetch Data ---
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
        // We fetch both to merge them for the "ALL" view
        // In a real large-scale app, you'd have a backend endpoint for /transactions/all
        // For now, we fetch both lists and merge client-side for the current page
        const [incRes, expRes] = await Promise.all([
            api.get(`/finance/incomes?page=${currentPage}&size=${PAGE_SIZE}&sort=incomeDate,desc`),
            api.get(`/finance/expenses?page=${currentPage}&size=${PAGE_SIZE}&sort=expenseDate,desc`)
        ]);

        setIncomes(incRes.data.content);
        setExpenses(expRes.data.content);

        // Merge for "ALL" view
        const combined = [
            ...incRes.data.content.map(i => ({ ...i, type: 'INCOME', date: i.incomeDate })),
            ...expRes.data.content.map(e => ({ ...e, type: 'EXPENSE', date: e.expenseDate }))
        ];
        // Sort by date descending
        combined.sort((a, b) => new Date(b.date) - new Date(a.date));
        setAllTransactions(combined);

        // Use the higher page count of the two (rough approximation for client-side merge)
        setTotalPages(Math.max(incRes.data.totalPages, expRes.data.totalPages));

    } catch (err) {
        console.error("Ledger sync failed", err);
    } finally {
        setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- Handlers ---
  const handleAddExpense = async (data) => {
    try {
        await api.post('/finance/expenses', data);
        setIsExpenseModalOpen(false);
        fetchData();
    } catch(err) { alert("Failed to log expense."); }
  };

  const handleAddIncome = async (data) => {
    try {
        await api.post('/finance/incomes', data);
        setIsIncomeModalOpen(false);
        fetchData();
    } catch(err) { alert("Failed to record income."); }
  };

  const handleDeleteExpense = async (id) => {
    if(!window.confirm("Delete expense record?")) return;
    await api.delete(`/finance/expenses/${id}`);
    fetchData();
  };

  const handleDeleteIncome = async (id) => {
    if(!window.confirm("Delete income record?")) return;
    await api.delete(`/finance/incomes/${id}`);
    fetchData();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground uppercase">
            Financial Ledger
          </h1>
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
            Consolidated Revenue & Operational Costs
          </p>
        </div>
        <div className="flex gap-2">
            <Button variant="tactical" size="sm" onClick={fetchData}>
                <RefreshCw className="w-4 h-4 mr-2" /> SYNC
            </Button>
            <Button variant="default" size="sm" onClick={() => setIsIncomeModalOpen(true)} className="bg-emerald-600 hover:bg-emerald-700">
                <TrendingUp className="w-4 h-4 mr-2" /> INCOME
            </Button>
            <Button variant="destructive" size="sm" onClick={() => setIsExpenseModalOpen(true)}>
                <TrendingDown className="w-4 h-4 mr-2" /> EXPENSE
            </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 border-b border-border">
          <button 
             onClick={() => setActiveTab("ALL")}
             className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'ALL' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          >
             <Layers className="w-3 h-3 inline-block mr-2" /> All Transactions
          </button>
          <button 
             onClick={() => setActiveTab("INCOME")}
             className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'INCOME' ? 'border-emerald-500 text-emerald-500' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          >
             <TrendingUp className="w-3 h-3 inline-block mr-2" /> Income
          </button>
          <button 
             onClick={() => setActiveTab("EXPENSE")}
             className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'EXPENSE' ? 'border-destructive text-destructive' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          >
             <TrendingDown className="w-3 h-3 inline-block mr-2" /> Expenses
          </button>
      </div>

      {/* Content Area */}
      {loading ? (
          <div className="flex flex-col items-center justify-center p-12 border border-dashed border-border rounded-sm">
             <Loader className="h-8 w-8 animate-spin text-primary mb-4" />
             <span className="text-xs font-mono uppercase text-muted-foreground">Syncing Ledger...</span>
          </div>
      ) : (
          <div className="min-h-[400px]">
             {activeTab === 'ALL' && <TransactionsTable transactions={allTransactions} />}
             {activeTab === 'INCOME' && <IncomeTable incomes={incomes} onDelete={handleDeleteIncome} />}
             {activeTab === 'EXPENSE' && <ExpensesTable expenses={expenses} onDelete={handleDeleteExpense} />}
             
             {/* Pagination (Simplified for unified view) */}
             <div className="mt-4">
                 <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
             </div>
          </div>
      )}

      {/* Modals */}
      <Modal isOpen={isExpenseModalOpen} onClose={() => setIsExpenseModalOpen(false)} title="LOG EXPENSE">
          <ExpenseForm onSubmit={handleAddExpense} onCancel={() => setIsExpenseModalOpen(false)} />
      </Modal>

      <Modal isOpen={isIncomeModalOpen} onClose={() => setIsIncomeModalOpen(false)} title="RECORD INCOME">
          <IncomeForm onSubmit={handleAddIncome} onCancel={() => setIsIncomeModalOpen(false)} />
      </Modal>
    </div>
  );
}

export default ExpensesPage;