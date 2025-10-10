package com.opsgrid.backend.repository;

import com.opsgrid.backend.entity.Driver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page; 
import org.springframework.data.domain.Pageable; 

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface DriverRepository extends JpaRepository<Driver, UUID> {

    
    Page<Driver> findAllByCompanyId(Integer companyId, Pageable pagable);

    
    Optional<Driver> findByIdAndCompanyId(UUID driverId, Integer companyId);
}