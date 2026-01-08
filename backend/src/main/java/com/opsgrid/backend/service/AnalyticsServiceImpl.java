package com.opsgrid.backend.service;

import com.opsgrid.backend.dto.DashboardStatsDTO;
import com.opsgrid.backend.dto.ShipmentStatusSummaryDTO;
import com.opsgrid.backend.dto.TruckStatusSummaryDTO;
import com.opsgrid.backend.entity.IssueStatus;
import com.opsgrid.backend.entity.ShipmentStatus;
import com.opsgrid.backend.entity.TruckStatus;
import com.opsgrid.backend.repository.DriverRepository;
import com.opsgrid.backend.repository.IssueRepository;
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
    private final DriverRepository driverRepository;
    private final IssueRepository issueRepository;

    @Override
    public List<ShipmentStatusSummaryDTO> getShipmentStatusSummary(Integer companyId) {
        // Corrected method name to match Repository
        return shipmentRepository.countByStatusForCompany(companyId);
    }

    @Override
    public List<TruckStatusSummaryDTO> getTruckStatusSummary(Integer companyId) {
        // Corrected method name to match Repository
        return truckRepository.countByStatusForCompany(companyId);
    }

    @Override
    public DashboardStatsDTO getDashboardStats(Integer companyId) {
        long totalDrivers = driverRepository.countByCompanyId(companyId);
        long activeTrucks = truckRepository.countByCompanyIdAndStatus(companyId, TruckStatus.WORKING);
        long pendingShipments = shipmentRepository.countByCompanyIdAndStatus(companyId, ShipmentStatus.PENDING);
        long openIssues = issueRepository.countByCompanyIdAndStatus(companyId, IssueStatus.OPEN);

        return new DashboardStatsDTO(totalDrivers, activeTrucks, pendingShipments, openIssues);
    }
}