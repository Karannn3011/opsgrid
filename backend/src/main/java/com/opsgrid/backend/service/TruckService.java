package com.opsgrid.backend.service;

import com.opsgrid.backend.dto.CreateTruckRequest;
import com.opsgrid.backend.dto.TruckDTO;
import org.springframework.data.domain.Page; 
import org.springframework.data.domain.Pageable; 

import java.util.List;

public interface TruckService {
    TruckDTO createTruck(CreateTruckRequest request, Integer companyId);

    Page<TruckDTO> getAllTrucks(Integer companyId, Pageable pagable);

    TruckDTO getTruckById(Integer id, Integer companyId);

    TruckDTO updateTruck(Integer id, CreateTruckRequest request, Integer companyId);

    void deleteTruck(Integer id, Integer companyId);
}