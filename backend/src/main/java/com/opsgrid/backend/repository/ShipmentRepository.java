package com.opsgrid.backend.repository;

import com.opsgrid.backend.entity.Shipment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ShipmentRepository extends JpaRepository<Shipment, Integer> {
    // We can add custom queries here later, for example, to find all shipments for a specific driver.
    List<Shipment> findByAssignedDriverId(UUID driverId);
}