package com.opsgrid.backend.dto;

import com.opsgrid.backend.entity.TruckStatus;

// This record represents a single row in our truck status aggregation result
public record TruckStatusSummaryDTO(
        TruckStatus status,
        long count
) {}