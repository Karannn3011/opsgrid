package com.opsgrid.backend.dto;

import com.opsgrid.backend.entity.TruckStatus;

import java.time.Instant;


public record TruckDTO(
        Integer id,
        String licensePlate,
        String make,
        String model,
        Integer year,
        Integer capacityKg,
        TruckStatus status,
        Instant createdAt,
        Integer companyId,
        String companyName
) {}