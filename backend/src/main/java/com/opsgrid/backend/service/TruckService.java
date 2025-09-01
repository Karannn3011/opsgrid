package com.opsgrid.backend.service;

import com.opsgrid.backend.dto.CreateTruckRequest;
import com.opsgrid.backend.dto.TruckDTO;

import java.util.List;

public interface TruckService {
    TruckDTO createTruck(CreateTruckRequest request);
    List<TruckDTO> getAllTrucks();
    TruckDTO getTruckById(Integer id);
    TruckDTO updateTruck(Integer id, CreateTruckRequest request);
    void deleteTruck(Integer id);
}