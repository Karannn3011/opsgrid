package com.opsgrid.backend.dto;

import com.opsgrid.backend.entity.TruckStatus;

import java.time.Instant;

// This DTO will be used in API responses to represent a truck.
public record TruckDTO(
        Integer id,
        String licensePlate,
        String make,
        String model,
        Integer year,
        Integer capacityKg,
        TruckStatus status,
        Instant createdAt
) {}