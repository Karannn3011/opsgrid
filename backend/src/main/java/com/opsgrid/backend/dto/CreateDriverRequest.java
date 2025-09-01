package com.opsgrid.backend.dto;

import java.util.UUID;

// This DTO is for the request body when creating or updating a driver profile.
public record CreateDriverRequest(
        UUID userId, // The ID of the user with ROLE_DRIVER
        String fullName,
        String licenseNumber,
        String contactNumber,
        Integer assignedTruckId // Can be null
) {}