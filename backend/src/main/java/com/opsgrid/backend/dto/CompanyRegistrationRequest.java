package com.opsgrid.backend.dto;

// DTO for the request body when a new company registers.
public record CompanyRegistrationRequest(
        String companyName,
        String adminUsername,
        String adminEmail,
        String adminPassword,
        String adminEmployeeId
) {}