package com.opsgrid.backend.service;

import com.opsgrid.backend.entity.Issue;
import reactor.core.publisher.Mono;

public interface AIService {
    // Return type is now Mono<String>
    Mono<String> getMaintenanceDiagnostics(Issue issue);
}