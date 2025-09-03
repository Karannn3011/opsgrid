package com.opsgrid.backend.repository;

import com.opsgrid.backend.entity.Truck;
import org.springframework.data.domain.Page; // Import Page
import org.springframework.data.domain.Pageable; // Import Pageable
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TruckRepository extends JpaRepository<Truck, Integer> {
    // UPDATED: This method now supports pagination and sorting
    Page<Truck> findAllByCompanyId(Integer companyId, Pageable pageable);
    
    Optional<Truck> findByIdAndCompanyId(Integer truckId, Integer companyId);
}