package com.opsgrid.backend.dto;

import com.opsgrid.backend.entity.ShipmentStatus;


public record ShipmentStatusSummaryDTO(
        ShipmentStatus status,
        long count
) {}