package com.opsgrid.backend.service;

import com.opsgrid.backend.entity.Issue;
import reactor.core.publisher.Mono;

public interface AIService {
    Mono<String> getMaintenanceDiagnostics(Issue issue);

    // Add this new method
    Mono<String> getFinancialAnalysis(String question, Integer companyId);
}