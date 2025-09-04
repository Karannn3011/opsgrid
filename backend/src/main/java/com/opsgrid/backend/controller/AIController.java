package com.opsgrid.backend.controller;

import com.opsgrid.backend.dto.AIResponseDTO;
import com.opsgrid.backend.entity.Issue;
import com.opsgrid.backend.repository.IssueRepository;
import com.opsgrid.backend.security.UserPrincipal;
import com.opsgrid.backend.service.AIService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
public class AIController {

    private final AIService aiService;
    private final IssueRepository issueRepository;

    @PostMapping("/diagnose-issue/{issueId}")
    public Mono<ResponseEntity<AIResponseDTO>> diagnoseIssue(
            @PathVariable Integer issueId,
            @AuthenticationPrincipal UserPrincipal principal) {

        // Find the issue first (synchronous part)
        Issue issue = issueRepository.findByIdAndCompanyId(issueId, principal.getCompanyId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Issue not found"));

        // Call the reactive service and then manually build the ResponseEntity
        return aiService.getMaintenanceDiagnostics(issue)
                .map(aiResponseDTO -> ResponseEntity
                        .ok() // Set 200 OK status
                        .contentType(MediaType.APPLICATION_JSON) // Explicitly set header to application/json
                        .body(aiResponseDTO) // Set our DTO as the body
                );
    }
}
