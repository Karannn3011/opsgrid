package com.opsgrid.backend.controller;

import com.opsgrid.backend.dto.CreateDriverRequest;
import com.opsgrid.backend.dto.DriverDTO;
import com.opsgrid.backend.service.DriverService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/drivers") // Base path for driver endpoints
@RequiredArgsConstructor
// Secure all methods in this controller for Managers and Admins
@PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
public class DriverController {

    private final DriverService driverService;

    // POST /api/v1/drivers - Create a new driver profile for an existing user
    @PostMapping
    public ResponseEntity<?> createDriverProfile(@RequestBody CreateDriverRequest request) {
        try {
            DriverDTO newDriver = driverService.createDriverProfile(request);
            return new ResponseEntity<>(newDriver, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            // Catches errors like "User not found", "User is not a driver", etc.
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // GET /api/v1/drivers - Get all driver profiles
    @GetMapping
    public ResponseEntity<List<DriverDTO>> getAllDrivers() {
        List<DriverDTO> drivers = driverService.getAllDrivers();
        return ResponseEntity.ok(drivers);
    }

    // GET /api/v1/drivers/{userId} - Get a single driver profile by their user ID
    @GetMapping("/{userId}")
    public ResponseEntity<DriverDTO> getDriverById(@PathVariable UUID userId) {
        try {
            DriverDTO driver = driverService.getDriverById(userId);
            return ResponseEntity.ok(driver);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // PUT /api/v1/drivers/{userId} - Update an existing driver profile
    @PutMapping("/{userId}")
    public ResponseEntity<?> updateDriverProfile(@PathVariable UUID userId, @RequestBody CreateDriverRequest request) {
        try {
            DriverDTO updatedDriver = driverService.updateDriverProfile(userId, request);
            return ResponseEntity.ok(updatedDriver);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}