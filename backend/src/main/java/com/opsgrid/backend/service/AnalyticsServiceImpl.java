package com.opsgrid.backend.service;

import com.opsgrid.backend.dto.ShipmentStatusSummaryDTO;
import com.opsgrid.backend.dto.TruckStatusSummaryDTO; 
import com.opsgrid.backend.repository.ShipmentRepository;
import com.opsgrid.backend.repository.TruckRepository; 
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AnalyticsServiceImpl implements AnalyticsService {

    private final ShipmentRepository shipmentRepository;
    private final TruckRepository truckRepository;

    @Override
    public List<ShipmentStatusSummaryDTO> getShipmentStatusSummary(Integer companyId) {
        return shipmentRepository.countByStatusForCompany(companyId);
    }

    @Override
    public List<TruckStatusSummaryDTO> getTruckStatusSummary(Integer companyId) {
        return truckRepository.countByStatusForCompany(companyId);
    }
}