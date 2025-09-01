package com.opsgrid.backend.repository;

import com.opsgrid.backend.entity.Truck;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TruckRepository extends JpaRepository<Truck, Integer> {
}