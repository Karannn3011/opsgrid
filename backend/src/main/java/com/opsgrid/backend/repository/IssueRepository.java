package com.opsgrid.backend.repository;

import com.opsgrid.backend.entity.Issue;
import org.springframework.data.jpa.repository.JpaRepository;


public interface IssueRepository extends JpaRepository<Issue, Integer> {
    // We will add custom queries here later (e.g., to find issues by manager or driver).


}