package com.opsgrid.backend.dto;

import com.opsgrid.backend.entity.TruckStatus;


public record CreateTruckRequest(
        String licensePlate,
        String make,
        String model,
        Integer year,
        Integer capacityKg,
        TruckStatus status
) {}