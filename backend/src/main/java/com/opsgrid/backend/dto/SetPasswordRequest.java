package com.opsgrid.backend.dto;

public record SetPasswordRequest(
        String token,
        String password
) {}