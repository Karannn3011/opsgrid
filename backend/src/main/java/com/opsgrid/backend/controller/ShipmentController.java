package com.opsgrid.backend.controller;

import com.opsgrid.backend.dto.CreateShipmentRequest;
import com.opsgrid.backend.dto.ShipmentDTO;
import com.opsgrid.backend.entity.ShipmentStatus;
import com.opsgrid.backend.entity.User;
import com.opsgrid.backend.service.ShipmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/shipments")
@RequiredArgsConstructor
public class ShipmentController {

    private final ShipmentService shipmentService;
    // We need the UserRepository to get the full User object from UserDetails
    private final com.opsgrid.backend.repository.UserRepository userRepository;

    // Endpoint for Managers/Admins to create a shipment
    @PostMapping
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<?> createShipment(@RequestBody CreateShipmentRequest request, @AuthenticationPrincipal UserDetails userDetails) {
        try {
            // Get the full User object of the manager creating the shipment
            User manager = userRepository.findByUsername(userDetails.getUsername()).orElseThrow();
            ShipmentDTO newShipment = shipmentService.createShipment(request, manager.getId());
            return new ResponseEntity<>(newShipment, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Endpoint for Managers/Admins to see all shipments
    @GetMapping
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<List<ShipmentDTO>> getAllShipments() {
        return ResponseEntity.ok(shipmentService.getAllShipments());
    }

    // Endpoint for a logged-in driver to see their own shipments
    @GetMapping("/my-shipments")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<List<ShipmentDTO>> getMyShipments(@AuthenticationPrincipal UserDetails userDetails) {
        User driverUser = userRepository.findByUsername(userDetails.getUsername()).orElseThrow();
        return ResponseEntity.ok(shipmentService.getShipmentsForDriver(driverUser.getId()));
    }

    // Endpoint for a driver or manager to update the status of a shipment
    @PutMapping("/{shipmentId}/status")
    @PreAuthorize("hasAnyRole('DRIVER', 'MANAGER', 'ADMIN')")
    public ResponseEntity<?> updateShipmentStatus(@PathVariable Integer shipmentId, @RequestBody String status) {
        try {
            // A bit of logic to safely convert the string to our enum
            ShipmentStatus newStatus = ShipmentStatus.valueOf(status.toUpperCase());
            ShipmentDTO updatedShipment = shipmentService.updateShipmentStatus(shipmentId, newStatus);
            return ResponseEntity.ok(updatedShipment);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid status value.");
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}