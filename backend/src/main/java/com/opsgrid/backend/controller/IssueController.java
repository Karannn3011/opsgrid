package com.opsgrid.backend.controller;

import com.opsgrid.backend.dto.CreateIssueRequest;
import com.opsgrid.backend.dto.IssueDTO;
import com.opsgrid.backend.entity.IssueStatus;
import com.opsgrid.backend.entity.User;
import com.opsgrid.backend.repository.UserRepository;
import com.opsgrid.backend.security.UserPrincipal;
import com.opsgrid.backend.service.IssueService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/issues")
@RequiredArgsConstructor
public class IssueController {

    private final IssueService issueService;
    private final UserRepository userRepository;

    @PostMapping
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<?> createIssue(@RequestBody CreateIssueRequest request, @AuthenticationPrincipal UserPrincipal principal) {
        try {
            User driverUser = userRepository.findByUsername(principal.getUsername()).orElseThrow();
            IssueDTO newIssue = issueService.createIssue(request, driverUser.getId(), principal.getCompanyId());
            return new ResponseEntity<>(newIssue, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<List<IssueDTO>> getAllIssues(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(issueService.getAllIssues(principal.getCompanyId()));
    }

    @PutMapping("/{issueId}/status")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<?> updateIssueStatus(@PathVariable Integer issueId, @RequestBody String status, @AuthenticationPrincipal UserPrincipal principal) {
        try {
            IssueStatus newStatus = IssueStatus.valueOf(status.toUpperCase());
            IssueDTO updatedIssue = issueService.updateIssueStatus(issueId, newStatus, principal.getCompanyId());
            return ResponseEntity.ok(updatedIssue);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid status value. Must be OPEN, RESOLVED, or ESCALATED.");
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}