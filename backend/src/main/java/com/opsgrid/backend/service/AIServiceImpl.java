package com.opsgrid.backend.service;

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
import java.time.Duration;

@Service
public class AIServiceImpl implements AIService {

    private final WebClient webClient;
    private static final Logger logger = LoggerFactory.getLogger(AIServiceImpl.class);

    @Value("${ai.service.url}")
    private String aiServiceBaseUrl;

    public AIServiceImpl(WebClient.Builder webClientBuilder) throws SSLException {
        HttpClient httpClient = HttpClient.create()
                .responseTimeout(Duration.ofSeconds(30))
                .secure(t -> {
                    try {
                        t.sslContext(SslContextBuilder.forClient()
                                .trustManager(InsecureTrustManagerFactory.INSTANCE).build());
                    } catch (SSLException e) {
                        logger.error("Failed to create insecure SSL context", e);
                    }
                });
        this.webClient = webClientBuilder
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .build();
    }

    @Override
    public Mono<String> getMaintenanceDiagnostics(Issue issue) {
        String prompt = String.format(
                "As an expert truck mechanic, a driver reported an issue. Title: '%s'. Description: '%s'. " +
                        "Provide a numbered list of 3 probable causes and a separate numbered list of 3 recommended actions.",
                issue.getTitle(),
                issue.getDescription()
        );

        String fullUrl = aiServiceBaseUrl + "/prompt/{prompt}";
        logger.info("Sending AI prompt...");

        return this.webClient.get()
                .uri(fullUrl, prompt)
                .retrieve()
                .bodyToMono(String.class) // We now expect and return a simple String
                .doOnSuccess(response -> logger.info("Successfully received AI response: " + response))
                .doOnError(error -> logger.error("Error calling AI service: ", error));
    }
}