package com.opsgrid.backend.dto;

import com.opsgrid.backend.entity.ExpenseCategory;
import java.math.BigDecimal;
import java.time.LocalDate;

public record CreateExpenseRequest(
        String description,
        BigDecimal amount,
        ExpenseCategory category,
        LocalDate expenseDate,
        Integer truckId // Optional: Only for maintenance expenses
) {}