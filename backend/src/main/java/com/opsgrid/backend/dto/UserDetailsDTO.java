package com.opsgrid.backend.dto;

import com.opsgrid.backend.entity.UserStatus;
import java.time.Instant;
import java.util.UUID;

public record UserDetailsDTO(
    UUID id,
    String username,
    String email,
    String employeeId,
    String roleName,
    UserStatus status,
    Instant createdAt
) {}