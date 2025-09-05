package com.opsgrid.backend.service;

import com.opsgrid.backend.dto.CreateExpenseRequest;
import com.opsgrid.backend.dto.ExpenseDTO;
import com.opsgrid.backend.dto.FinanceRecordDTO;
import com.opsgrid.backend.dto.IncomeDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface FinanceService {
    Page<ExpenseDTO> getExpenses(Integer companyId, Pageable pageable);
    ExpenseDTO createExpense(CreateExpenseRequest expenseRequest, Integer companyId);
    void deleteExpense(Integer expenseId, Integer companyId);

    Page<IncomeDTO> getIncomes(Integer companyId, Pageable pageable);
    IncomeDTO createIncome(IncomeDTO incomeDTO, Integer companyId);
    void deleteIncome(Integer incomeId, Integer companyId);

    Page<FinanceRecordDTO> getAllFinanceRecords(Integer companyId, Pageable pageable);
}