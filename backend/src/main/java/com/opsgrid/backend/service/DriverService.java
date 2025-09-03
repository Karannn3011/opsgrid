package com.opsgrid.backend.service;

import com.opsgrid.backend.dto.CreateDriverRequest;
import com.opsgrid.backend.dto.DriverDTO;
import org.springframework.data.domain.Page; // Import Page
import org.springframework.data.domain.Pageable; // Import Pageable

import java.util.List;
import java.util.UUID;

public interface DriverService {
    DriverDTO createDriverProfile(CreateDriverRequest request, Integer companyId);
    Page<DriverDTO> getAllDrivers(Integer companyId, Pageable pageable);
    DriverDTO getDriverById(UUID userId, Integer companyId);
    DriverDTO updateDriverProfile(UUID userId, CreateDriverRequest request, Integer companyId);
}