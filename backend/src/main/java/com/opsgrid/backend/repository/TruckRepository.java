package com.opsgrid.backend.repository;

import com.opsgrid.backend.entity.Truck;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TruckRepository extends JpaRepository<Truck, Integer> {
    Optional<Truck> findAllByCompanyId(Integer companyId);
    Optional<Truck> findByIdAndCompanyId(Integer truckId, Integer companyId);
}