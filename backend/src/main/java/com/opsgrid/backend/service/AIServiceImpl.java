package com.opsgrid.backend.service;

import com.opsgrid.backend.dto.AIResponseDTO;
import com.opsgrid.backend.entity.Issue;
import io.netty.handler.ssl.SslContextBuilder;
import io.netty.handler.ssl.util.InsecureTrustManagerFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.netty.http.client.HttpClient;

import javax.net.ssl.SSLException;
import java.time.Duration; // Import Duration

@Service
public class AIServiceImpl implements AIService {

    private final WebClient webClient;
    private static final Logger logger = LoggerFactory.getLogger(AIServiceImpl.class);

    @Value("${ai.service.url}")
    private String aiServiceBaseUrl;

    public AIServiceImpl(WebClient.Builder webClientBuilder) throws SSLException {
        // ++ START: TIMEOUT CONFIGURATION ++
        HttpClient httpClient = HttpClient.create()
                // Set a response timeout (e.g., 30 seconds)
                .responseTimeout(Duration.ofSeconds(30))
                .secure(t -> {
                    try {
                        t.sslContext(SslContextBuilder.forClient()
                                .trustManager(InsecureTrustManagerFactory.INSTANCE)
                                .build());
                    } catch (SSLException e) {
                        logger.error("Failed to create insecure SSL context", e);
                    }
                });
        // ++ END: TIMEOUT CONFIGURATION ++

        this.webClient = webClientBuilder
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .build();
    }

    @Override
    public Mono<AIResponseDTO> getMaintenanceDiagnostics(Issue issue) {
        String prompt = String.format(
                "As an expert truck mechanic, a driver has reported a maintenance issue. " +
                        "The issue title is '%s' and the description is '%s'. " +
                        "Please provide a numbered list of 3 most probable causes and a separate numbered list of 3 immediate recommended actions for the driver or manager. "
                        +
                        "Keep the response concise and clear.",
                issue.getTitle(),
                issue.getDescription());

        String fullUrl = aiServiceBaseUrl + "/{prompt}";

        // Corrected logging to show the actual prompt being sent
        logger.info("Sending AI prompt...");
        logger.debug("Prompt content: {}", prompt); // You can uncomment this for more detailed logs

        return this.webClient.get()
                .uri(fullUrl, prompt)
                .retrieve()
                .bodyToMono(String.class)
                .map(AIResponseDTO::new)
                .doOnSuccess(response -> logger.info("Successfully received AI response." + response.responseText))
                .doOnError(error -> logger.error("Error calling AI service: ", error))
                .onErrorResume(error -> Mono.just(new AIResponseDTO(
                        "Error: Could not get a response from the AI service. It may be offline or taking too long to respond.")));
    }
}
