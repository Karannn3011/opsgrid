package com.opsgrid.backend.service;

import com.opsgrid.backend.dto.CreateShipmentRequest;
import com.opsgrid.backend.dto.ShipmentDTO;
import com.opsgrid.backend.entity.*;
import com.opsgrid.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
    private final CompanyRepository companyRepository;

    @Override
    @Transactional
    public ShipmentDTO createShipment(CreateShipmentRequest request, UUID managerId, Integer companyId) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found with id: " + companyId));

        // Ensure the manager, driver, and truck all belong to the same company
        User manager = userRepository.findByIdAndCompanyId(managerId, companyId)
                .orElseThrow(() -> new RuntimeException("Manager not found in this company"));
        Driver driver = driverRepository.findByIdAndCompanyId(request.assignedDriverId(), companyId)
                .orElseThrow(() -> new RuntimeException("Driver not found in this company"));
        Truck truck = truckRepository.findByIdAndCompanyId(request.assignedTruckId(), companyId)
                .orElseThrow(() -> new RuntimeException("Truck not found in this company"));

        // 4. Create and save the new shipment
        Shipment shipment = new Shipment();
        shipment.setDescription(request.description());
        shipment.setOrigin(request.origin());
        shipment.setDestination(request.destination());
        shipment.setCreatedByManager(manager);
        shipment.setAssignedDriver(driver);
        shipment.setAssignedTruck(truck);
        shipment.setStatus(ShipmentStatus.PENDING); // Initial status
        shipment.setCompany(company);

        Shipment savedShipment = shipmentRepository.save(shipment);
        return convertToDto(savedShipment);
    }

    @Override
    public Page<ShipmentDTO> getAllShipments(Integer companyId, Pageable pageable) {
        Page<Shipment> shipmentPage = shipmentRepository.findAllByCompanyId(companyId, pageable);
        return shipmentPage.map(this::convertToDto);
    }

    @Override
    public Page<ShipmentDTO> getShipmentsForDriver(UUID driverId, Integer companyId, Pageable pageable) {
        Page<Shipment> shipmentPage = shipmentRepository.findByAssignedDriverIdAndCompanyId(driverId, companyId, pageable);
        return shipmentPage.map(this::convertToDto);
    }

    @Override
    @Transactional
    public ShipmentDTO updateShipmentStatus(Integer shipmentId, ShipmentStatus status, Integer companyId) {
        Shipment shipment = shipmentRepository.findByIdAndCompanyId(shipmentId, companyId)
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
                shipment.getCompletedAt(),
                shipment.getCompany().getId(),
                shipment.getCompany().getName()
        );
    }
}