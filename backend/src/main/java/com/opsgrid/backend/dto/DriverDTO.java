package com.opsgrid.backend.dto;

import java.util.UUID;


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