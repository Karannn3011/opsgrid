package com.opsgrid.backend.service;

import com.opsgrid.backend.dto.CreateDriverRequest;
import com.opsgrid.backend.dto.DriverDTO;

import java.util.List;
import java.util.UUID;

public interface DriverService {
    DriverDTO createDriverProfile(CreateDriverRequest request);
    List<DriverDTO> getAllDrivers();
    DriverDTO getDriverById(UUID userId);
    DriverDTO updateDriverProfile(UUID userId, CreateDriverRequest request);
}