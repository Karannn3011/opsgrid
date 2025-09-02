package com.opsgrid.backend.service;

import com.opsgrid.backend.dto.CreateDriverRequest;
import com.opsgrid.backend.dto.DriverDTO;

import java.util.List;
import java.util.UUID;

public interface DriverService {
    DriverDTO createDriverProfile(CreateDriverRequest request, Integer companyId);
    List<DriverDTO> getAllDrivers(Integer companyId);
    DriverDTO getDriverById(UUID userId, Integer companyId);
    DriverDTO updateDriverProfile(UUID userId, CreateDriverRequest request, Integer companyId);
}