package com.opsgrid.backend.repository;

import com.opsgrid.backend.entity.Driver;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface DriverRepository extends JpaRepository<Driver, UUID> {

    // Find all drivers belonging to a specific company
    List<Driver> findAllByCompanyId(Integer companyId);

    // Find a single driver by their ID and company ID to ensure data isolation
    Optional<Driver> findByIdAndCompanyId(UUID driverId, Integer companyId);
}