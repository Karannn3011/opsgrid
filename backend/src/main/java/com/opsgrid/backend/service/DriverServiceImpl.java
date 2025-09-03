package com.opsgrid.backend.service;

import com.opsgrid.backend.dto.CreateDriverRequest;
import com.opsgrid.backend.dto.DriverDTO;
import com.opsgrid.backend.entity.Company;
import com.opsgrid.backend.entity.Driver;
import com.opsgrid.backend.entity.Truck;
import com.opsgrid.backend.entity.User;
import com.opsgrid.backend.repository.CompanyRepository;
import com.opsgrid.backend.repository.DriverRepository;
import com.opsgrid.backend.repository.TruckRepository;
import com.opsgrid.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page; // Import Page
import org.springframework.data.domain.Pageable; // Import Pageable

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DriverServiceImpl implements DriverService {

    private final DriverRepository driverRepository;
    private final UserRepository userRepository;
    private final TruckRepository truckRepository;
    private final CompanyRepository companyRepository;

    @Override
    @Transactional
    public DriverDTO createDriverProfile(CreateDriverRequest request, Integer companyId) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found with id: " + companyId));
        // 1. Find the corresponding User...
        User user = userRepository.findById(request.userId())
                .orElseThrow(() -> new RuntimeException("User not found with id: " + request.userId()));
        if (!"ROLE_DRIVER".equals(user.getRole().getName())) {
            throw new RuntimeException("User is not a driver.");
        }

        // 2. Check if a driver profile already exists...
        if (driverRepository.existsById(request.userId())) {
            throw new RuntimeException("Driver profile already exists for this user.");
        }

        // 3. Create the new Driver entity
        Driver driver = new Driver();
        driver.setUser(user);
        driver.setCompany(company);
        // REMOVED THE LINE: driver.setId(user.getId());
        driver.setFullName(request.fullName());
        driver.setLicenseNumber(request.licenseNumber());
        driver.setContactNumber(request.contactNumber());

        // 4. Optionally assign a truck...
        if (request.assignedTruckId() != null) {
            Truck truck = truckRepository.findByIdAndCompanyId(request.assignedTruckId(), companyId)
                    .orElseThrow(() -> new RuntimeException("Truck not found with id: " + request.assignedTruckId()));
            driver.setAssignedTruck(truck);
        }

        Driver savedDriver = driverRepository.save(driver);
        return convertToDto(savedDriver);
    }

    @Override
    public Page<DriverDTO> getAllDrivers(Integer companyId, Pageable pageable) {
        Page<Driver> driverPage = driverRepository.findAllByCompanyId(companyId, pageable);
        return driverPage.map(this::convertToDto);
    }

    @Override
    public DriverDTO getDriverById(UUID userId, Integer companyId) {
        Driver driver = driverRepository.findByIdAndCompanyId(userId, companyId)
                .orElseThrow(() -> new RuntimeException("Driver profile not found for user id: " + userId));
        return convertToDto(driver);
    }

    @Override
    @Transactional
    public DriverDTO updateDriverProfile(UUID userId, CreateDriverRequest request, Integer companyId) {
        Driver driver = driverRepository.findByIdAndCompanyId(userId, companyId)
                .orElseThrow(() -> new RuntimeException("Driver profile not found for user id: " + userId));

        driver.setFullName(request.fullName());
        driver.setLicenseNumber(request.licenseNumber());
        driver.setContactNumber(request.contactNumber());

        // Handle truck assignment update
        if (request.assignedTruckId() != null) {
            Truck truck = truckRepository.findByIdAndCompanyId(request.assignedTruckId(), companyId)
                    .orElseThrow(() -> new RuntimeException("Truck not found with id: " + request.assignedTruckId()));
            driver.setAssignedTruck(truck);
        } else {
            driver.setAssignedTruck(null);
        }

        Driver updatedDriver = driverRepository.save(driver);
        return convertToDto(updatedDriver);
    }

    // Helper to convert the complex Driver entity to a flat DTO
    private DriverDTO convertToDto(Driver driver) {
        return new DriverDTO(
                driver.getId(),
                driver.getUser().getUsername(),
                driver.getUser().getEmail(),
                driver.getFullName(),
                driver.getLicenseNumber(),
                driver.getContactNumber(),
                driver.getAssignedTruck() != null ? driver.getAssignedTruck().getId() : null,
                driver.getAssignedTruck() != null ? driver.getAssignedTruck().getLicensePlate() : null,
                driver.getCompany().getId(),
                driver.getCompany().getName()
        );
    }
}