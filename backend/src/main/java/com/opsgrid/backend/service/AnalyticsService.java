package com.opsgrid.backend.service;

import com.opsgrid.backend.dto.ShipmentStatusSummaryDTO;
import com.opsgrid.backend.dto.TruckStatusSummaryDTO;
import com.opsgrid.backend.dto.TruckStatusSummaryDTO; // Import

import java.util.List;

public interface AnalyticsService {
    List<ShipmentStatusSummaryDTO> getShipmentStatusSummary(Integer companyId);
    List<TruckStatusSummaryDTO> getTruckStatusSummary(Integer companyId);
}