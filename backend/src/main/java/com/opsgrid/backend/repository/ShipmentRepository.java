package com.opsgrid.backend.repository;

import com.opsgrid.backend.dto.ShipmentStatusSummaryDTO;
import com.opsgrid.backend.entity.Shipment;
import org.springframework.data.domain.Page; 
import org.springframework.data.domain.Pageable; 
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ShipmentRepository extends JpaRepository<Shipment, Integer> {

    Optional<Shipment> findByIdAndCompanyId(Integer shipmentId, Integer companyId);

    
    Page<Shipment> findAllByCompanyId(Integer companyId, Pageable pageable);

    
    Page<Shipment> findByAssignedDriverIdAndCompanyId(UUID driverId, Integer companyId, Pageable pageable);

    @Query("SELECT new com.opsgrid.backend.dto.ShipmentStatusSummaryDTO(s.status, COUNT(s)) " +
            "FROM Shipment s WHERE s.company.id = :companyId GROUP BY s.status")
    List<ShipmentStatusSummaryDTO> countByStatusForCompany(@Param("companyId") Integer companyId);
}