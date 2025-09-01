package com.opsgrid.backend.dto;

// Using a Java Record for a concise, immutable DTO
public record InviteUserRequest(
        String username,
        String email,
        String employeeId,
        Integer roleId // The ID of the role (e.g., Manager, Driver)
) {}