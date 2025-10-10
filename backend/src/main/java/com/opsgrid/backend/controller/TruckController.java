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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

@RestController
@RequestMapping("/api/v1/trucks") 
@RequiredArgsConstructor

@PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
public class TruckController {

    private final TruckService truckService;

    
    @PostMapping
    public ResponseEntity<TruckDTO> createTruck(@RequestBody CreateTruckRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        TruckDTO newTruck = truckService.createTruck(request, principal.getCompanyId());
        return new ResponseEntity<>(newTruck, HttpStatus.CREATED);
    }

    
    @GetMapping
    public ResponseEntity<Page<TruckDTO>> getAllTrucks(@AuthenticationPrincipal UserPrincipal principal,
            Pageable pageable) {
        Page<TruckDTO> trucks = truckService.getAllTrucks(principal.getCompanyId(), pageable);
        return ResponseEntity.ok(trucks);
    }

    
    @GetMapping("/{id}")
    public ResponseEntity<TruckDTO> getTruckById(@PathVariable Integer id,
            @AuthenticationPrincipal UserPrincipal principal) {
        try {
            TruckDTO truck = truckService.getTruckById(id, principal.getCompanyId());
            return ResponseEntity.ok(truck);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    
    @PutMapping("/{id}")
    public ResponseEntity<TruckDTO> updateTruck(@PathVariable Integer id, @RequestBody CreateTruckRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        try {
            TruckDTO updatedTruck = truckService.updateTruck(id, request, principal.getCompanyId());
            return ResponseEntity.ok(updatedTruck);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTruck(@PathVariable Integer id,
            @AuthenticationPrincipal UserPrincipal principal) {
        try {
            truckService.deleteTruck(id, principal.getCompanyId());
            return ResponseEntity.noContent().build(); 
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}