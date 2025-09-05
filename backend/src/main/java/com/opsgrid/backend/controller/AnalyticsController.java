package com.opsgrid.backend.controller;

import com.opsgrid.backend.dto.ShipmentStatusSummaryDTO;
import com.opsgrid.backend.dto.TruckStatusSummaryDTO;
import com.opsgrid.backend.security.UserPrincipal;
import com.opsgrid.backend.service.AIServiceImpl;
import com.opsgrid.backend.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/analytics")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
public class AnalyticsController {

    private final AnalyticsService analyticsService;



    @GetMapping("/shipment-summary")
    public ResponseEntity<List<ShipmentStatusSummaryDTO>> getShipmentSummary(@AuthenticationPrincipal UserPrincipal principal) {
        List<ShipmentStatusSummaryDTO> summary = analyticsService.getShipmentStatusSummary(principal.getCompanyId());
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/truck-summary")
    public ResponseEntity<List<TruckStatusSummaryDTO>> getTruckSummary(@AuthenticationPrincipal UserPrincipal principal) {
        List<TruckStatusSummaryDTO> summary = analyticsService.getTruckStatusSummary(principal.getCompanyId());
        return ResponseEntity.ok(summary);
    }
}