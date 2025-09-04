package com.opsgrid.backend.dto;

import com.opsgrid.backend.entity.ShipmentStatus;

// This record represents a single row in our aggregation result
public record ShipmentStatusSummaryDTO(
        ShipmentStatus status,
        long count
) {}