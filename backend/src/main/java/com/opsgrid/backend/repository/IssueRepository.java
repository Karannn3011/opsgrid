package com.opsgrid.backend.repository;

import com.opsgrid.backend.entity.Issue;
import com.opsgrid.backend.entity.IssueStatus; // Import this
import org.springframework.data.domain.Page; 
import org.springframework.data.domain.Pageable; 
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface IssueRepository extends JpaRepository<Issue, Integer> {

    Optional<Issue> findByIdAndCompanyId(Integer issueId, Integer companyId);
    
    Page<Issue> findAllByCompanyId(Integer companyId, Pageable pageable);
    
    Page<Issue> findByReportedByDriver_Id(UUID driverId, Pageable pageable);

    // Added: For Dashboard Stats
    long countByCompanyIdAndStatus(Integer companyId, IssueStatus status);
}