package com.opsgrid.backend.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

public record MaintenanceLogDTO(
        Integer id,
        Integer truckId,
        String truckLicensePlate,
        String description,
        BigDecimal cost,
        LocalDate serviceDate,
        Instant createdAt
) {}