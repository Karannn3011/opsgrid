package com.opsgrid.backend.repository;

import com.opsgrid.backend.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Integer> {
    List<Expense> findAllByCompanyIdAndExpenseDateAfter(Integer companyId, LocalDate ninetyDaysAgo);
}