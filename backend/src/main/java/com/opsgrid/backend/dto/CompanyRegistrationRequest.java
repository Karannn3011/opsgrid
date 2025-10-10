package com.opsgrid.backend.dto;


public record CompanyRegistrationRequest(
        String companyName,
        String adminUsername,
        String adminEmail,
        String adminPassword,
        String adminEmployeeId
) {}