package com.opsgrid.backend.service;

import com.opsgrid.backend.dto.CreateShipmentRequest;
import com.opsgrid.backend.dto.ShipmentDTO;
import com.opsgrid.backend.entity.ShipmentStatus;
import java.util.List;
import java.util.UUID;

public interface ShipmentService {
    // All methods now require a companyId
    ShipmentDTO createShipment(CreateShipmentRequest request, UUID managerId, Integer companyId);
    List<ShipmentDTO> getAllShipments(Integer companyId);
    List<ShipmentDTO> getShipmentsForDriver(UUID driverId, Integer companyId);
    ShipmentDTO updateShipmentStatus(Integer shipmentId, ShipmentStatus status, Integer companyId);
}