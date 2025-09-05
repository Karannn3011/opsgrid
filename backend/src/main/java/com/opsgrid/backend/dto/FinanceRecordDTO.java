package com.opsgrid.backend.dto;

import com.opsgrid.backend.entity.ExpenseCategory;

import java.math.BigDecimal;
import java.time.LocalDate;

public record FinanceRecordDTO(
        Integer id,
        TransactionType type,
        String description,
        BigDecimal amount,
        LocalDate date,
        ExpenseCategory category // Can be null for income
) {}