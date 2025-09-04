package com.opsgrid.backend.dto;

// This DTO is for the frontend to send the issue ID to the backend
public record AIRequestDTO(
    String prompt
) {}