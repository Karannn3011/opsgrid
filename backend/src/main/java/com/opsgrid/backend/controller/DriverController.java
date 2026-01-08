package com.opsgrid.backend.controller;

import com.opsgrid.backend.dto.CreateDriverRequest;
import com.opsgrid.backend.dto.DriverDTO;
import com.opsgrid.backend.security.UserPrincipal;
import com.opsgrid.backend.service.DriverService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/drivers")
@RequiredArgsConstructor
public class DriverController {

    private final DriverService driverService;

    // 🟢 ALLOW DRIVER: This will now work because the class-level block is gone
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

    // 🔒 RESTRICT OTHERS: Manually add Manager/Admin check to all other methods

    @PostMapping
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<?> createDriverProfile(@RequestBody CreateDriverRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        // ... (implementation same as before)
        return new ResponseEntity<>(driverService.createDriverProfile(request, principal.getCompanyId()),
                HttpStatus.CREATED);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<Page<DriverDTO>> getAllDrivers(@AuthenticationPrincipal UserPrincipal principal,
            Pageable pageable) {
        return ResponseEntity.ok(driverService.getAllDrivers(principal.getCompanyId(), pageable));
    }

    @GetMapping("/{userId}")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<DriverDTO> getDriverById(@PathVariable UUID userId,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(driverService.getDriverById(userId, principal.getCompanyId()));
    }

    @PutMapping("/{userId}")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<?> updateDriverProfile(@PathVariable UUID userId, @RequestBody CreateDriverRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(driverService.updateDriverProfile(userId, request, principal.getCompanyId()));
    }
}