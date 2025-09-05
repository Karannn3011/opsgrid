package com.opsgrid.backend.service;

import com.opsgrid.backend.dto.CreateMaintenanceLogRequest;
import com.opsgrid.backend.dto.MaintenanceLogDTO;
import com.opsgrid.backend.entity.Company;
import com.opsgrid.backend.entity.MaintenanceLog;
import com.opsgrid.backend.entity.Truck;
import com.opsgrid.backend.repository.CompanyRepository;
import com.opsgrid.backend.repository.MaintenanceLogRepository;
import com.opsgrid.backend.repository.TruckRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MaintenanceLogServiceImpl implements MaintenanceLogService {

    private final MaintenanceLogRepository maintenanceLogRepository;
    private final TruckRepository truckRepository;
    private final CompanyRepository companyRepository;

    @Override
    public Page<MaintenanceLogDTO> getLogsForTruck(Integer companyId, Integer truckId, Pageable pageable) {
        Page<MaintenanceLog> logPage = maintenanceLogRepository.findByCompanyIdAndTruckId(companyId, truckId, pageable);
        return logPage.map(this::convertToDto);
    }

    @Override
    public MaintenanceLogDTO createLog(Integer companyId, CreateMaintenanceLogRequest request) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        Truck truck = truckRepository.findByIdAndCompanyId(request.truckId(), companyId)
                .orElseThrow(() -> new RuntimeException("Truck not found in this company"));

        MaintenanceLog log = new MaintenanceLog();
        log.setCompany(company);
        log.setTruck(truck);
        log.setDescription(request.description());
        log.setCost(request.cost());
        log.setServiceDate(request.serviceDate());

        MaintenanceLog savedLog = maintenanceLogRepository.save(log);
        return convertToDto(savedLog);
    }

    @Override
    public void deleteLog(Integer companyId, Integer logId) {
        MaintenanceLog log = maintenanceLogRepository.findByIdAndCompanyId(logId, companyId)
                .orElseThrow(() -> new RuntimeException("Maintenance log not found"));
        maintenanceLogRepository.delete(log);
    }

    private MaintenanceLogDTO convertToDto(MaintenanceLog log) {
        return new MaintenanceLogDTO(
                log.getId(),
                log.getTruck().getId(),
                log.getTruck().getLicensePlate(),
                log.getDescription(),
                log.getCost(),
                log.getServiceDate(),
                log.getCreatedAt()
        );
    }
}