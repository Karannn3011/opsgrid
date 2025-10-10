package com.opsgrid.backend.repository;

import com.opsgrid.backend.entity.Issue;
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
}