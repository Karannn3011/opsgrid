package com.opsgrid.backend.controller;

import com.opsgrid.backend.dto.CreateIssueRequest;
import com.opsgrid.backend.dto.IssueDTO;
import com.opsgrid.backend.entity.IssueStatus;
import com.opsgrid.backend.entity.User;
import com.opsgrid.backend.repository.UserRepository;
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

    // Endpoint for a DRIVER to create/report a new issue
    @PostMapping
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<?> createIssue(@RequestBody CreateIssueRequest request, @AuthenticationPrincipal UserDetails userDetails) {
        try {
            // Get the full User object for the logged-in driver
            User driverUser = userRepository.findByUsername(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("Authenticated driver user not found"));

            IssueDTO newIssue = issueService.createIssue(request, driverUser.getId());
            return new ResponseEntity<>(newIssue, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Endpoint for MANAGERS/ADMINS to view all issues
    @GetMapping
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<List<IssueDTO>> getAllIssues() {
        return ResponseEntity.ok(issueService.getAllIssues());
    }

    // Endpoint for MANAGERS/ADMINS to update an issue's status (e.g., to RESOLVED or ESCALATED)
    @PutMapping("/{issueId}/status")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<?> updateIssueStatus(@PathVariable Integer issueId, @RequestBody String status) {
        try {
            IssueStatus newStatus = IssueStatus.valueOf(status.toUpperCase());
            IssueDTO updatedIssue = issueService.updateIssueStatus(issueId, newStatus);
            return ResponseEntity.ok(updatedIssue);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid status value. Must be OPEN, RESOLVED, or ESCALATED.");
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}