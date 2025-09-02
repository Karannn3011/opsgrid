package com.opsgrid.backend.repository;

import com.opsgrid.backend.entity.Issue;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List; // Import List
import java.util.Optional; // Import Optional

public interface IssueRepository extends JpaRepository<Issue, Integer> {

    // Find a single issue by its ID and company ID
    Optional<Issue> findByIdAndCompanyId(Integer issueId, Integer companyId);

    // Find all issues for a given company
    List<Issue> findAllByCompanyId(Integer companyId);
}