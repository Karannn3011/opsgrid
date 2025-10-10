package com.opsgrid.backend.service;

import com.opsgrid.backend.dto.CreateIssueRequest;
import com.opsgrid.backend.dto.IssueDTO;
import com.opsgrid.backend.entity.IssueStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface IssueService {
    IssueDTO createIssue(CreateIssueRequest request, UUID driverId, Integer companyId);

    IssueDTO getIssueById(Integer issueId, Integer companyId);
    IssueDTO updateIssueStatus(Integer issueId, IssueStatus status, Integer companyId);
    Page<IssueDTO> getAllIssues(Integer companyId, Pageable pageable);
    Page<IssueDTO> getIssuesForDriver(UUID driverId, Pageable pageable);
    
}