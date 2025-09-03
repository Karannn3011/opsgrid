package com.opsgrid.backend.repository;

import com.opsgrid.backend.entity.Issue;
import org.springframework.data.domain.Page; // Import Page
import org.springframework.data.domain.Pageable; // Import Pageable
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface IssueRepository extends JpaRepository<Issue, Integer> {

    Optional<Issue> findByIdAndCompanyId(Integer issueId, Integer companyId);

    // UPDATED: Now returns a Page
    Page<Issue> findAllByCompanyId(Integer companyId, Pageable pageable);

    // UPDATED: Now returns a Page
    Page<Issue> findByReportedByDriver_Id(UUID driverId, Pageable pageable);
}