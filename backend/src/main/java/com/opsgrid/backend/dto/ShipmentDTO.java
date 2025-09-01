package com.opsgrid.backend.dto;

import com.opsgrid.backend.entity.ShipmentStatus;

import java.time.Instant;
import java.util.UUID;

// DTO for representing a shipment in API responses.
public record ShipmentDTO(
        Integer id,
        String description,
        String origin,
        String destination,
        ShipmentStatus status,
        UUID assignedDriverId,
        String assignedDriverName,
        Integer assignedTruckId,
        String assignedTruckLicensePlate,
        UUID createdByManagerId,
        String createdByManagerUsername,
        Instant createdAt,
        Instant completedAt
) {}