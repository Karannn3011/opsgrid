package com.opsgrid.backend.repository;

import com.opsgrid.backend.entity.MaintenanceLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MaintenanceLogRepository extends JpaRepository<MaintenanceLog, Integer> {

    // Find all logs for a specific truck within a company, with pagination
    Page<MaintenanceLog> findByCompanyIdAndTruckId(Integer companyId, Integer truckId, Pageable pageable);

    // Find a single log by its ID and company ID for security
    Optional<MaintenanceLog> findByIdAndCompanyId(Integer id, Integer companyId);
}