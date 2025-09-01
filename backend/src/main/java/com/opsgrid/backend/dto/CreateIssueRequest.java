package com.opsgrid.backend.dto;

import com.opsgrid.backend.entity.IssuePriority;

// DTO for the request body when a driver reports a new issue.
public record CreateIssueRequest(
        String title,
        String description,
        IssuePriority priority,
        Integer relatedTruckId
) {}