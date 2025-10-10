package com.opsgrid.backend.dto;

import java.util.UUID;


public record CreateShipmentRequest(
        String description,
        String origin,
        String destination,
        UUID assignedDriverId,
        Integer assignedTruckId
) {}