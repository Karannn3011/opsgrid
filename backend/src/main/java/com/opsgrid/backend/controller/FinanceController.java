package com.opsgrid.backend.controller;

import com.opsgrid.backend.dto.CreateExpenseRequest;
import com.opsgrid.backend.dto.ExpenseDTO;
import com.opsgrid.backend.dto.IncomeDTO;
import com.opsgrid.backend.security.UserPrincipal;
import com.opsgrid.backend.service.FinanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/finance")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
public class FinanceController {

    private final FinanceService financeService;

    // Expenses Endpoints
    @GetMapping("/expenses")
    public ResponseEntity<Page<ExpenseDTO>> getExpenses(@AuthenticationPrincipal UserPrincipal principal, Pageable pageable) {
        Page<ExpenseDTO> expenses = financeService.getExpenses(principal.getCompanyId(), pageable);
        return ResponseEntity.ok(expenses);
    }

    @PostMapping("/expenses")
    public ResponseEntity<ExpenseDTO> createExpense(@RequestBody CreateExpenseRequest expenseRequest, @AuthenticationPrincipal UserPrincipal principal) {
        ExpenseDTO createdExpense = financeService.createExpense(expenseRequest, principal.getCompanyId());
        return new ResponseEntity<>(createdExpense, HttpStatus.CREATED);
    }

    @DeleteMapping("/expenses/{expenseId}")
    public ResponseEntity<Void> deleteExpense(@PathVariable Integer expenseId, @AuthenticationPrincipal UserPrincipal principal) {
        financeService.deleteExpense(expenseId, principal.getCompanyId());
        return ResponseEntity.noContent().build();
    }

    // Income Endpoints
    @GetMapping("/incomes")
    public ResponseEntity<Page<IncomeDTO>> getIncomes(@AuthenticationPrincipal UserPrincipal principal, Pageable pageable) {
        Page<IncomeDTO> incomes = financeService.getIncomes(principal.getCompanyId(), pageable);
        return ResponseEntity.ok(incomes);
    }

    @PostMapping("/incomes")
    public ResponseEntity<IncomeDTO> createIncome(@RequestBody IncomeDTO incomeDTO, @AuthenticationPrincipal UserPrincipal principal) {
        IncomeDTO createdIncome = financeService.createIncome(incomeDTO, principal.getCompanyId());
        return new ResponseEntity<>(createdIncome, HttpStatus.CREATED);
    }

    @DeleteMapping("/incomes/{incomeId}")
    public ResponseEntity<Void> deleteIncome(@PathVariable Integer incomeId, @AuthenticationPrincipal UserPrincipal principal) {
        financeService.deleteIncome(incomeId, principal.getCompanyId());
        return ResponseEntity.noContent().build();
    }
}