package com.opsgrid.backend.controller;

import com.opsgrid.backend.dto.AIAnalysisRequest; // Import the new DTO
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

import java.util.Map;

@RestController
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
public class AIController {

    private final AIService aiService;
    private final IssueRepository issueRepository;

    @PostMapping("/diagnose-issue/{issueId}")
    public Mono<ResponseEntity<String>> diagnoseIssue(
            @PathVariable Integer issueId,
            @AuthenticationPrincipal UserPrincipal principal) {

        Issue issue = issueRepository.findByIdAndCompanyId(issueId, principal.getCompanyId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Issue not found"));

        return aiService.getMaintenanceDiagnostics(issue)
                .map(aiResponseText -> ResponseEntity
                        .ok()
                        .contentType(MediaType.TEXT_PLAIN)
                        .body(aiResponseText)
                );
    }

    // Add this new endpoint
    @PostMapping("/analyze-kpi-trend")
    @PreAuthorize("hasRole('ADMIN')")
    public Mono<ResponseEntity<Map<String, String>>> analyzeKpiTrend( // Return type is now Map
                                                                      @RequestBody AIAnalysisRequest request,
                                                                      @AuthenticationPrincipal UserPrincipal principal) {

        return aiService.getFinancialAnalysis(request.question(), principal.getCompanyId())
                .map(aiResponseText -> {
                    // Wrap the plain text response in a JSON object: { "response": "..." }
                    Map<String, String> responseBody = Map.of("response", aiResponseText);
                    // Return a standard JSON response
                    return ResponseEntity.ok(responseBody);
                });
    }
}