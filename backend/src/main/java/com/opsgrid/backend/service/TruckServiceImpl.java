package com.opsgrid.backend.service;

import com.opsgrid.backend.dto.CreateTruckRequest;
import com.opsgrid.backend.dto.TruckDTO;
import com.opsgrid.backend.entity.Truck;
import com.opsgrid.backend.repository.TruckRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TruckServiceImpl implements TruckService {

    private final TruckRepository truckRepository;

    @Override
    public TruckDTO createTruck(CreateTruckRequest request) {
        Truck truck = new Truck();
        truck.setLicensePlate(request.licensePlate());
        truck.setMake(request.make());
        truck.setModel(request.model());
        truck.setYear(request.year());
        truck.setCapacityKg(request.capacityKg());
        truck.setStatus(request.status());

        Truck savedTruck = truckRepository.save(truck);
        return convertToDto(savedTruck);
    }

    @Override
    public List<TruckDTO> getAllTrucks() {
        return truckRepository.findAll()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public TruckDTO getTruckById(Integer id) {
        Truck truck = truckRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Truck not found with id: " + id));
        return convertToDto(truck);
    }

    @Override
    public TruckDTO updateTruck(Integer id, CreateTruckRequest request) {
        Truck truck = truckRepository.findById(id)
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
    public void deleteTruck(Integer id) {
        Truck truck = truckRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Truck not found with id: " + id));
        truckRepository.delete(truck);
    }

    // Helper method to convert Entity to DTO
    private TruckDTO convertToDto(Truck truck) {
        return new TruckDTO(
                truck.getId(),
                truck.getLicensePlate(),
                truck.getMake(),
                truck.getModel(),
                truck.getYear(),
                truck.getCapacityKg(),
                truck.getStatus(),
                truck.getCreatedAt()
        );
    }
}