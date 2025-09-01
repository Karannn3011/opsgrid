package com.opsgrid.backend.dto;

import com.opsgrid.backend.entity.IssuePriority;
import com.opsgrid.backend.entity.IssueStatus;

import java.time.Instant;
import java.util.UUID;

// DTO for representing a full issue in API responses.
public record IssueDTO(
        Integer id,
        String title,
        String description,
        IssueStatus status,
        IssuePriority priority,
        UUID reportedByDriverId,
        String reportedByDriverName,
        UUID assignedToManagerId,
        String assignedToManagerUsername,
        Integer relatedTruckId,
        String relatedTruckLicensePlate,
        Instant createdAt
) {}