package com.opsgrid.backend.repository;

import com.opsgrid.backend.entity.Shipment;
import org.springframework.data.domain.Page; // Import Page
import org.springframework.data.domain.Pageable; // Import Pageable
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface ShipmentRepository extends JpaRepository<Shipment, Integer> {

    Optional<Shipment> findByIdAndCompanyId(Integer shipmentId, Integer companyId);

    // UPDATED: Find all shipments for a given company, with pagination
    Page<Shipment> findAllByCompanyId(Integer companyId, Pageable pageable);

    // UPDATED: Find all shipments for a specific driver, with pagination
    Page<Shipment> findByAssignedDriverIdAndCompanyId(UUID driverId, Integer companyId, Pageable pageable);
}