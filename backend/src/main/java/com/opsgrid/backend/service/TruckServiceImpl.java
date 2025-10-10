package com.opsgrid.backend.service;

import com.opsgrid.backend.dto.CreateTruckRequest;
import com.opsgrid.backend.dto.TruckDTO;
import com.opsgrid.backend.entity.Company;
import com.opsgrid.backend.entity.Truck;
import com.opsgrid.backend.repository.CompanyRepository;
import com.opsgrid.backend.repository.TruckRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page; 
import org.springframework.data.domain.Pageable; 

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TruckServiceImpl implements TruckService {

    private final TruckRepository truckRepository;
    private final CompanyRepository companyRepository;

    @Override
    public TruckDTO createTruck(CreateTruckRequest request, Integer companyId) {
        Truck truck = new Truck();
        truck.setLicensePlate(request.licensePlate());
        truck.setMake(request.make());
        truck.setModel(request.model());
        truck.setYear(request.year());
        truck.setCapacityKg(request.capacityKg());
        truck.setStatus(request.status());
        Company company = companyRepository.findById(companyId).orElseThrow();
        truck.setCompany(company);
        Truck savedTruck = truckRepository.save(truck);
        return convertToDto(savedTruck);
    }

    @Override
    public Page<TruckDTO> getAllTrucks(Integer companyId, Pageable pageable) {
        
        Page<Truck> truckPage = truckRepository.findAllByCompanyId(companyId, pageable);
        
        
        return truckPage.map(this::convertToDto);
    }

    @Override
    public TruckDTO getTruckById(Integer id, Integer companyId) {
        Truck truck = truckRepository.findByIdAndCompanyId(id, companyId)
                .orElseThrow(() -> new RuntimeException("Truck not found with id: " + id));
        return convertToDto(truck);
    }

    @Override
    public TruckDTO updateTruck(Integer id, CreateTruckRequest request, Integer companyId) {
        Truck truck = truckRepository.findByIdAndCompanyId(id, companyId)
                .orElseThrow(() -> new RuntimeException("Truck not found with id: " + id));

        truck.setLicensePlate(request.licensePlate());
        truck.setMake(request.make());
        truck.setModel(request.model());
        truck.setYear(request.year());
        truck.setCapacityKg(request.capacityKg());
        truck.setStatus(request.status());

        Truck updatedTruck = truckRepository.save(truck);
        return convertToDto(updatedTruck);
    }

    @Override
    public void deleteTruck(Integer id, Integer companyId) {
        Truck truck = truckRepository.findByIdAndCompanyId(id, companyId)
                .orElseThrow(() -> new RuntimeException("Truck not found with id: " + id));
        truckRepository.delete(truck);
    }

    
    private TruckDTO convertToDto(Truck truck) {
        return new TruckDTO(
                truck.getId(),
                truck.getLicensePlate(),
                truck.getMake(),
                truck.getModel(),
                truck.getYear(),
                truck.getCapacityKg(),
                truck.getStatus(),
                truck.getCreatedAt(),
                truck.getCompany().getId(),
                truck.getCompany().getName());
    }
}