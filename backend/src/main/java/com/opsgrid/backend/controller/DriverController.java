package com.opsgrid.backend.controller;

import com.opsgrid.backend.dto.CreateDriverRequest;
import com.opsgrid.backend.dto.DriverDTO;
import com.opsgrid.backend.security.UserPrincipal; // Import UserPrincipal
import com.opsgrid.backend.service.DriverService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal; // Import this
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/drivers")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
public class DriverController {

    private final DriverService driverService;

    @GetMapping("/me")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<DriverDTO> getMyDriverProfile(@AuthenticationPrincipal UserPrincipal principal) {
        try {
            DriverDTO driver = driverService.getDriverById(principal.getId(), principal.getCompanyId());
            return ResponseEntity.ok(driver);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<?> createDriverProfile(@RequestBody CreateDriverRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        try {
            DriverDTO newDriver = driverService.createDriverProfile(request, principal.getCompanyId());
            return new ResponseEntity<>(newDriver, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<Page<DriverDTO>> getAllDrivers(@AuthenticationPrincipal UserPrincipal principal, Pageable pageable) {
        Page<DriverDTO> drivers = driverService.getAllDrivers(principal.getCompanyId(), pageable);
        return ResponseEntity.ok(drivers);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<DriverDTO> getDriverById(@PathVariable UUID userId,
            @AuthenticationPrincipal UserPrincipal principal) {
        try {
            DriverDTO driver = driverService.getDriverById(userId, principal.getCompanyId());
            return ResponseEntity.ok(driver);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{userId}")
    public ResponseEntity<?> updateDriverProfile(@PathVariable UUID userId, @RequestBody CreateDriverRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        try {
            DriverDTO updatedDriver = driverService.updateDriverProfile(userId, request, principal.getCompanyId());
            return ResponseEntity.ok(updatedDriver);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}