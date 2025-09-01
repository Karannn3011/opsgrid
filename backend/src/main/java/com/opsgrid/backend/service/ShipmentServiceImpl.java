package com.opsgrid.backend.service;

import com.opsgrid.backend.dto.CreateShipmentRequest;
import com.opsgrid.backend.dto.ShipmentDTO;
import com.opsgrid.backend.entity.*;
import com.opsgrid.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ShipmentServiceImpl implements ShipmentService {

    private final ShipmentRepository shipmentRepository;
    private final UserRepository userRepository;
    private final DriverRepository driverRepository;
    private final TruckRepository truckRepository;

    @Override
    @Transactional
    public ShipmentDTO createShipment(CreateShipmentRequest request, UUID managerId) {
        // 1. Find the manager creating the shipment
        User manager = userRepository.findById(managerId)
                .orElseThrow(() -> new RuntimeException("Manager not found with id: " + managerId));

        // 2. Find the assigned driver
        Driver driver = driverRepository.findById(request.assignedDriverId())
                .orElseThrow(() -> new RuntimeException("Driver not found with id: " + request.assignedDriverId()));

        // 3. Find the assigned truck
        Truck truck = truckRepository.findById(request.assignedTruckId())
                .orElseThrow(() -> new RuntimeException("Truck not found with id: " + request.assignedTruckId()));

        // 4. Create and save the new shipment
        Shipment shipment = new Shipment();
        shipment.setDescription(request.description());
        shipment.setOrigin(request.origin());
        shipment.setDestination(request.destination());
        shipment.setCreatedByManager(manager);
        shipment.setAssignedDriver(driver);
        shipment.setAssignedTruck(truck);
        shipment.setStatus(ShipmentStatus.PENDING); // Initial status

        Shipment savedShipment = shipmentRepository.save(shipment);
        return convertToDto(savedShipment);
    }

    @Override
    public List<ShipmentDTO> getAllShipments() {
        return shipmentRepository.findAll().stream().map(this::convertToDto).collect(Collectors.toList());
    }

    @Override
    public List<ShipmentDTO> getShipmentsForDriver(UUID driverId) {
        // Now implemented using our new custom repository method
        return shipmentRepository.findByAssignedDriverId(driverId)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ShipmentDTO updateShipmentStatus(Integer shipmentId, ShipmentStatus status) {
        Shipment shipment = shipmentRepository.findById(shipmentId)
                .orElseThrow(() -> new RuntimeException("Shipment not found with id: " + shipmentId));

        shipment.setStatus(status);
        if (status == ShipmentStatus.DELIVERED || status == ShipmentStatus.CANCELLED) {
            shipment.setCompletedAt(Instant.now());
        }

        Shipment updatedShipment = shipmentRepository.save(shipment);
        return convertToDto(updatedShipment);
    }

    // Helper to convert the complex Shipment entity to a DTO
    private ShipmentDTO convertToDto(Shipment shipment) {
        return new ShipmentDTO(
                shipment.getId(),
                shipment.getDescription(),
                shipment.getOrigin(),
                shipment.getDestination(),
                shipment.getStatus(),
                shipment.getAssignedDriver() != null ? shipment.getAssignedDriver().getId() : null,
                shipment.getAssignedDriver() != null ? shipment.getAssignedDriver().getFullName() : null,
                shipment.getAssignedTruck() != null ? shipment.getAssignedTruck().getId() : null,
                shipment.getAssignedTruck() != null ? shipment.getAssignedTruck().getLicensePlate() : null,
                shipment.getCreatedByManager() != null ? shipment.getCreatedByManager().getId() : null,
                shipment.getCreatedByManager() != null ? shipment.getCreatedByManager().getUsername() : null,
                shipment.getCreatedAt(),
                shipment.getCompletedAt()
        );
    }
}