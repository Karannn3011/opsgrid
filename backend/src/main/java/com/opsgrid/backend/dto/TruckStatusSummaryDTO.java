package com.opsgrid.backend.dto;

import com.opsgrid.backend.entity.TruckStatus;


public record TruckStatusSummaryDTO(
        TruckStatus status,
        long count
) {}