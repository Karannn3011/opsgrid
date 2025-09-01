package com.opsgrid.backend.dto;

import com.opsgrid.backend.entity.TruckStatus;

// This DTO is used for the request body when creating a new truck.
public record CreateTruckRequest(
        String licensePlate,
        String make,
        String model,
        Integer year,
        Integer capacityKg,
        TruckStatus status
) {}