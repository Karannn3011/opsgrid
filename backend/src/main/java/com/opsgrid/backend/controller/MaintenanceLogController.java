package com.opsgrid.backend.controller;

import com.opsgrid.backend.dto.CreateMaintenanceLogRequest;
import com.opsgrid.backend.dto.MaintenanceLogDTO;
import com.opsgrid.backend.security.UserPrincipal;
import com.opsgrid.backend.service.MaintenanceLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/maintenance-logs")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
public class MaintenanceLogController {

    private final MaintenanceLogService maintenanceLogService;

    @GetMapping("/truck/{truckId}")
    public ResponseEntity<Page<MaintenanceLogDTO>> getLogsForTruck(
            @PathVariable Integer truckId,
            @AuthenticationPrincipal UserPrincipal principal,
            Pageable pageable) {

        Page<MaintenanceLogDTO> logs = maintenanceLogService.getLogsForTruck(principal.getCompanyId(), truckId, pageable);
        return ResponseEntity.ok(logs);
    }

    @PostMapping
    public ResponseEntity<MaintenanceLogDTO> createLog(
            @RequestBody CreateMaintenanceLogRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {

        MaintenanceLogDTO newLog = maintenanceLogService.createLog(principal.getCompanyId(), request);
        return new ResponseEntity<>(newLog, HttpStatus.CREATED);
    }

    @DeleteMapping("/{logId}")
    public ResponseEntity<Void> deleteLog(
            @PathVariable Integer logId,
            @AuthenticationPrincipal UserPrincipal principal) {

        maintenanceLogService.deleteLog(principal.getCompanyId(), logId);
        return ResponseEntity.noContent().build();
    }
}