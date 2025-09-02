package com.opsgrid.backend.repository;

import com.opsgrid.backend.entity.Shipment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ShipmentRepository extends JpaRepository<Shipment, Integer> {

    // Find a single shipment by its ID and company ID
    Optional<Shipment> findByIdAndCompanyId(Integer shipmentId, Integer companyId);

    // Find all shipments for a given company
    List<Shipment> findAllByCompanyId(Integer companyId);

    // Find all shipments for a specific driver within a specific company
    List<Shipment> findByAssignedDriverIdAndCompanyId(UUID driverId, Integer companyId);
}