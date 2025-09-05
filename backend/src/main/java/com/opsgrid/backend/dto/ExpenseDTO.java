package com.opsgrid.backend.dto;

import com.opsgrid.backend.entity.ExpenseCategory;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

public record ExpenseDTO(
        Integer id,
        String description,
        BigDecimal amount,
        ExpenseCategory category,
        LocalDate expenseDate,
        Instant createdAt,
        Integer companyId
) {}