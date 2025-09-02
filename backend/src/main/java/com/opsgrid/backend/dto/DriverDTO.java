package com.opsgrid.backend.dto;

import java.util.UUID;

// This DTO will be the API representation of a driver's full profile.
public record DriverDTO(
        UUID userId,
        String username,
        String email,
        String fullName,
        String licenseNumber,
        String contactNumber,
        Integer assignedTruckId,
        String assignedTruckLicensePlate,
        Integer companyId,
        String companyName
) {}