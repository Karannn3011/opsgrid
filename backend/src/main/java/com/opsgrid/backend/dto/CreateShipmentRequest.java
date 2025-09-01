package com.opsgrid.backend.dto;

import java.util.UUID;

// DTO for the request body when creating a new shipment.
public record CreateShipmentRequest(
        String description,
        String origin,
        String destination,
        UUID assignedDriverId,
        Integer assignedTruckId
) {}