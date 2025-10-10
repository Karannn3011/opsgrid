package com.opsgrid.backend.dto;

import com.opsgrid.backend.entity.IssuePriority;


public record CreateIssueRequest(
        String title,
        String description,
        IssuePriority priority,
        Integer relatedTruckId
) {}