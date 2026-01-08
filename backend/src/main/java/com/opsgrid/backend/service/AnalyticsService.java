package com.opsgrid.backend.service;

import com.opsgrid.backend.dto.DashboardStatsDTO; // Import the new DTO
import com.opsgrid.backend.dto.ShipmentStatusSummaryDTO;
import com.opsgrid.backend.dto.TruckStatusSummaryDTO;

import java.util.List;

public interface AnalyticsService {
    List<ShipmentStatusSummaryDTO> getShipmentStatusSummary(Integer companyId);
    List<TruckStatusSummaryDTO> getTruckStatusSummary(Integer companyId);
    DashboardStatsDTO getDashboardStats(Integer companyId);
}