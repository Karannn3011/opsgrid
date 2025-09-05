package com.opsgrid.backend.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

public record IncomeDTO(
        Integer id,
        String description,
        BigDecimal amount,
        LocalDate incomeDate,
        Integer shipmentId,
        Instant createdAt,
        Integer companyId
) {}