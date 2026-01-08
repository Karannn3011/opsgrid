package com.opsgrid.backend.controller;

import com.opsgrid.backend.dto.CreateShipmentRequest;
import com.opsgrid.backend.dto.ShipmentDTO;
import com.opsgrid.backend.entity.ShipmentStatus;
import com.opsgrid.backend.security.UserPrincipal;
import com.opsgrid.backend.service.ShipmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/shipments")
@RequiredArgsConstructor
public class ShipmentController {

    private final ShipmentService shipmentService;

    // ... createShipment, getAllShipments, getMyShipments (History) ...
    @PostMapping
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<ShipmentDTO> createShipment(@RequestBody CreateShipmentRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        ShipmentDTO newShipment = shipmentService.createShipment(request, principal.getId(), principal.getCompanyId());
        return new ResponseEntity<>(newShipment, HttpStatus.CREATED);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<Page<ShipmentDTO>> getAllShipments(@AuthenticationPrincipal UserPrincipal principal,
            Pageable pageable) {
        Page<ShipmentDTO> shipments = shipmentService.getAllShipments(principal.getCompanyId(), pageable);
        return ResponseEntity.ok(shipments);
    }

    @GetMapping("/my-shipments")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<Page<ShipmentDTO>> getMyShipments(@AuthenticationPrincipal UserPrincipal principal,
            Pageable pageable) {
        return ResponseEntity
                .ok(shipmentService.getShipmentsForDriver(principal.getId(), principal.getCompanyId(), pageable));
    }

    // --- NEW ENDPOINT: My Active Shipments ---
    @GetMapping("/my-active-shipments")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<List<ShipmentDTO>> getMyActiveShipments(@AuthenticationPrincipal UserPrincipal principal) {
        // Returns a list of active shipments (Not delivered)
        return ResponseEntity
                .ok(shipmentService.getActiveShipmentsForDriver(principal.getId(), principal.getCompanyId()));
    }

    // ... getShipmentById, updateShipmentStatus, updateShipment, deleteShipment
    // (keep existing) ...
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN', 'DRIVER')")
    public ResponseEntity<ShipmentDTO> getShipmentById(@PathVariable Integer id,
            @AuthenticationPrincipal UserPrincipal principal) {
        try {
            ShipmentDTO shipment = shipmentService.getShipmentById(id, principal.getCompanyId());
            return ResponseEntity.ok(shipment);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN', 'DRIVER')")
    public ResponseEntity<ShipmentDTO> updateShipmentStatus(@PathVariable Integer id,
            @RequestBody Map<String, String> statusUpdate,
            @AuthenticationPrincipal UserPrincipal principal) {
        try {
            String statusStr = statusUpdate.get("status");
            ShipmentStatus status = ShipmentStatus.valueOf(statusStr);
            ShipmentDTO updated = shipmentService.updateShipmentStatus(id, status, principal.getCompanyId());
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<ShipmentDTO> updateShipment(@PathVariable Integer id,
            @RequestBody CreateShipmentRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        try {
            ShipmentDTO updated = shipmentService.updateShipment(id, request, principal.getCompanyId());
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<Void> deleteShipment(@PathVariable Integer id,
            @AuthenticationPrincipal UserPrincipal principal) {
        try {
            shipmentService.deleteShipment(id, principal.getCompanyId());
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}