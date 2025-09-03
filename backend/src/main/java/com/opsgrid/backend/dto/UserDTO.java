package com.opsgrid.backend.dto;

import java.util.UUID;

// A simple DTO to represent a user for selection in forms.
public record UserDTO(
        UUID id,
        String username,
        String email
) {}