package com.opsgrid.backend.service;

import com.opsgrid.backend.dto.CreateIssueRequest;
import com.opsgrid.backend.dto.IssueDTO;
import com.opsgrid.backend.entity.IssueStatus;

import java.util.List;
import java.util.UUID;

public interface IssueService {
    IssueDTO createIssue(CreateIssueRequest request, UUID driverId);
    List<IssueDTO> getAllIssues();
    IssueDTO getIssueById(Integer issueId);
    IssueDTO updateIssueStatus(Integer issueId, IssueStatus status);
    // We could also add methods like assignIssueToManager, etc. later
}