package com.opsgrid.backend.controller;

import com.opsgrid.backend.dto.CreateShipmentRequest;
import com.opsgrid.backend.dto.ShipmentDTO;
import com.opsgrid.backend.entity.ShipmentStatus;
import com.opsgrid.backend.entity.User;
import com.opsgrid.backend.security.UserPrincipal; // Import this
import com.opsgrid.backend.service.ShipmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/shipments")
@RequiredArgsConstructor
public class ShipmentController {

    private final ShipmentService shipmentService;
    private final com.opsgrid.backend.repository.UserRepository userRepository;

    @PostMapping
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<?> createShipment(@RequestBody CreateShipmentRequest request, @AuthenticationPrincipal UserPrincipal principal) {
        try {
            User manager = userRepository.findByUsername(principal.getUsername()).orElseThrow();
            ShipmentDTO newShipment = shipmentService.createShipment(request, manager.getId(), principal.getCompanyId());
            return new ResponseEntity<>(newShipment, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<List<ShipmentDTO>> getAllShipments(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(shipmentService.getAllShipments(principal.getCompanyId()));
    }

    @GetMapping("/my-shipments")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<List<ShipmentDTO>> getMyShipments(@AuthenticationPrincipal UserPrincipal principal) {
        User driverUser = userRepository.findByUsername(principal.getUsername()).orElseThrow();
        return ResponseEntity.ok(shipmentService.getShipmentsForDriver(driverUser.getId(), principal.getCompanyId()));
    }

    @PutMapping("/{shipmentId}/status")
    @PreAuthorize("hasAnyRole('DRIVER', 'MANAGER', 'ADMIN')")
    public ResponseEntity<?> updateShipmentStatus(@PathVariable Integer shipmentId, @RequestBody String status, @AuthenticationPrincipal UserPrincipal principal) {
        try {
            ShipmentStatus newStatus = ShipmentStatus.valueOf(status.toUpperCase());
            ShipmentDTO updatedShipment = shipmentService.updateShipmentStatus(shipmentId, newStatus, principal.getCompanyId());
            return ResponseEntity.ok(updatedShipment);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid status value.");
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}