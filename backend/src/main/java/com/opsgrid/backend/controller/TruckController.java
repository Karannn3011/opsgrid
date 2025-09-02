package com.opsgrid.backend.controller;

import com.opsgrid.backend.dto.CreateTruckRequest;
import com.opsgrid.backend.dto.TruckDTO;
import com.opsgrid.backend.security.UserPrincipal;
import com.opsgrid.backend.service.TruckService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/trucks") // Base path for all truck endpoints [cite: 112]
@RequiredArgsConstructor
// Secure all methods in this controller. Only Managers or Admins can access.
@PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
public class TruckController {

    private final TruckService truckService;

    // POST /api/v1/trucks - Create a new truck [cite: 112]
    @PostMapping
    public ResponseEntity<TruckDTO> createTruck(@RequestBody CreateTruckRequest request, @AuthenticationPrincipal UserPrincipal principal) {
        TruckDTO newTruck = truckService.createTruck(request, principal.getCompanyId());
        return new ResponseEntity<>(newTruck, HttpStatus.CREATED);
    }

    // GET /api/v1/trucks - Get all trucks [cite: 112]
    @GetMapping
    public ResponseEntity<List<TruckDTO>> getAllTrucks(@AuthenticationPrincipal UserPrincipal principal) {
        List<TruckDTO> trucks = truckService.getAllTrucks(principal.getCompanyId());
        return ResponseEntity.ok(trucks);
    }

    // GET /api/v1/trucks/{id} - Get a single truck by its ID [cite: 112]
    @GetMapping("/{id}")
    public ResponseEntity<TruckDTO> getTruckById(@PathVariable Integer id, @AuthenticationPrincipal UserPrincipal principal) {
        try {
            TruckDTO truck = truckService.getTruckById(id, principal.getCompanyId());
            return ResponseEntity.ok(truck);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // PUT /api/v1/trucks/{id} - Update an existing truck [cite: 112]
    @PutMapping("/{id}")
    public ResponseEntity<TruckDTO> updateTruck(@PathVariable Integer id, @RequestBody CreateTruckRequest request, @AuthenticationPrincipal UserPrincipal principal) {
        try {
            TruckDTO updatedTruck = truckService.updateTruck(id, request, principal.getCompanyId());
            return ResponseEntity.ok(updatedTruck);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE /api/v1/trucks/{id} - Delete a truck
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTruck(@PathVariable Integer id, @AuthenticationPrincipal UserPrincipal principal) {
        try {
            truckService.deleteTruck(id, principal.getCompanyId());
            return ResponseEntity.noContent().build(); // Standard response for successful delete
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}