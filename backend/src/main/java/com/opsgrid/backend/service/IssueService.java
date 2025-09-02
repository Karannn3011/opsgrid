package com.opsgrid.backend.service;

import com.opsgrid.backend.dto.CreateIssueRequest;
import com.opsgrid.backend.dto.IssueDTO;
import com.opsgrid.backend.entity.IssueStatus;

import java.util.List;
import java.util.UUID;

public interface IssueService {
    IssueDTO createIssue(CreateIssueRequest request, UUID driverId, Integer companyId);
    List<IssueDTO> getAllIssues(Integer companyId);
    IssueDTO getIssueById(Integer issueId, Integer companyId);
    IssueDTO updateIssueStatus(Integer issueId, IssueStatus status, Integer companyId);
    // We could also add methods like assignIssueToManager, etc. later
}