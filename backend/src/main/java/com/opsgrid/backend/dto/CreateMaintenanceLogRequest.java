package com.opsgrid.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record CreateMaintenanceLogRequest(
        Integer truckId,
        String description,
        BigDecimal cost,
        LocalDate serviceDate
) {}