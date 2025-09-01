package com.opsgrid.backend.repository;

import com.opsgrid.backend.entity.Driver;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface DriverRepository extends JpaRepository<Driver, UUID> {
}