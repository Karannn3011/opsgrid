package com.opsgrid.backend.service;

import com.opsgrid.backend.dto.AIResponseDTO;
import com.opsgrid.backend.entity.Issue;
import reactor.core.publisher.Mono;

public interface AIService {
    Mono<AIResponseDTO> getMaintenanceDiagnostics(Issue issue);
}