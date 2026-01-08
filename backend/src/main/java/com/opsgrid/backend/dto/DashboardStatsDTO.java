package com.opsgrid.backend.dto;

public record DashboardStatsDTO(
    long totalDrivers,
    long activeTrucks,
    long pendingShipments,
    long openIssues
) {}