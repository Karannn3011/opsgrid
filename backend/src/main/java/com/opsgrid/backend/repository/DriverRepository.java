package com.opsgrid.backend.repository;

import com.opsgrid.backend.entity.Driver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page; // Import Page
import org.springframework.data.domain.Pageable; // Import Pageable

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface DriverRepository extends JpaRepository<Driver, UUID> {

    // Find all drivers belonging to a specific company
    Page<Driver> findAllByCompanyId(Integer companyId, Pageable pagable);

    // Find a single driver by their ID and company ID to ensure data isolation
    Optional<Driver> findByIdAndCompanyId(UUID driverId, Integer companyId);
}