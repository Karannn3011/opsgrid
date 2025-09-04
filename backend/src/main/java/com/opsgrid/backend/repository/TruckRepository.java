package com.opsgrid.backend.repository;

import java.util.Optional;

import com.opsgrid.backend.dto.TruckStatusSummaryDTO; // Import the new DTO
import com.opsgrid.backend.entity.Truck;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query; // Import Query
import org.springframework.data.repository.query.Param; // Import Param

import java.util.List; // Import List
import java.util.Optional;

public interface TruckRepository extends JpaRepository<Truck, Integer> {
    // UPDATED: This method now supports pagination and sorting
    Page<Truck> findAllByCompanyId(Integer companyId, Pageable pageable);

    Optional<Truck> findByIdAndCompanyId(Integer truckId, Integer companyId);

    @Query("SELECT new com.opsgrid.backend.dto.TruckStatusSummaryDTO(t.status, COUNT(t)) " +
            "FROM Truck t WHERE t.company.id = :companyId GROUP BY t.status")
    List<TruckStatusSummaryDTO> countByStatusForCompany(@Param("companyId") Integer companyId);
}