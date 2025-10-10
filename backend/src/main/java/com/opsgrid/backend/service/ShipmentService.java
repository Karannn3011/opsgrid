package com.opsgrid.backend.service;

import com.opsgrid.backend.dto.CreateShipmentRequest;
import com.opsgrid.backend.dto.ShipmentDTO;
import com.opsgrid.backend.entity.ShipmentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface ShipmentService {
    
    ShipmentDTO createShipment(CreateShipmentRequest request, UUID managerId, Integer companyId);
    Page<ShipmentDTO> getAllShipments(Integer companyId, Pageable pageable);
    Page<ShipmentDTO> getShipmentsForDriver(UUID driverId, Integer companyId, Pageable pageable);
    ShipmentDTO updateShipmentStatus(Integer shipmentId, ShipmentStatus status, Integer companyId);
}