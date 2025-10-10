package com.opsgrid.backend.dto;

import java.util.UUID;


public record CreateDriverRequest(
        UUID userId, 
        String fullName,
        String licenseNumber,
        String contactNumber,
        Integer assignedTruckId 
) {}