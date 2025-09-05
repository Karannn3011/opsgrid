package com.opsgrid.backend.service;

import com.opsgrid.backend.dto.CreateMaintenanceLogRequest;
import com.opsgrid.backend.dto.MaintenanceLogDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface MaintenanceLogService {
    Page<MaintenanceLogDTO> getLogsForTruck(Integer companyId, Integer truckId, Pageable pageable);
    MaintenanceLogDTO createLog(Integer companyId, CreateMaintenanceLogRequest request);
    void deleteLog(Integer companyId, Integer logId);
}