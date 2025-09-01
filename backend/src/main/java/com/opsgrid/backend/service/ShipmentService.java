package com.opsgrid.backend.service;

import com.opsgrid.backend.dto.CreateShipmentRequest;
import com.opsgrid.backend.dto.ShipmentDTO;
import com.opsgrid.backend.entity.ShipmentStatus;
import java.util.List;
import java.util.UUID;

public interface ShipmentService {
    ShipmentDTO createShipment(CreateShipmentRequest request, UUID managerId);
    List<ShipmentDTO> getAllShipments();
    List<ShipmentDTO> getShipmentsForDriver(UUID driverId);
    ShipmentDTO updateShipmentStatus(Integer shipmentId, ShipmentStatus status);
}