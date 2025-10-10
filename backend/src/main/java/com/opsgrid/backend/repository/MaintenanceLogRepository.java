package com.opsgrid.backend.repository;

import com.opsgrid.backend.entity.MaintenanceLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MaintenanceLogRepository extends JpaRepository<MaintenanceLog, Integer> {

    
    Page<MaintenanceLog> findByCompanyIdAndTruckId(Integer companyId, Integer truckId, Pageable pageable);

    
    Optional<MaintenanceLog> findByIdAndCompanyId(Integer id, Integer companyId);
}