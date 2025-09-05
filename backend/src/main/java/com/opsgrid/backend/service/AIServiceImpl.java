package com.opsgrid.backend.service;

import com.opsgrid.backend.entity.Expense;
import com.opsgrid.backend.entity.Income;
import com.opsgrid.backend.entity.Issue;
import com.opsgrid.backend.repository.ExpenseRepository;
import com.opsgrid.backend.repository.IncomeRepository;
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
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AIServiceImpl implements AIService {

    private final WebClient webClient;
    private static final Logger logger = LoggerFactory.getLogger(AIServiceImpl.class);

    @Value("${ai.service.url}")
    private String aiServiceBaseUrl;

    // Inject the new repositories
    private final ExpenseRepository expenseRepository;
    private final IncomeRepository incomeRepository;

    public AIServiceImpl(WebClient.Builder webClientBuilder, ExpenseRepository expenseRepository, IncomeRepository incomeRepository) throws SSLException {
        this.expenseRepository = expenseRepository;
        this.incomeRepository = incomeRepository;
        HttpClient httpClient = HttpClient.create()
                .responseTimeout(Duration.ofSeconds(60)) // Increased timeout for potentially larger analysis
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
        return callAIService(prompt);
    }

    @Override
    public Mono<String> getFinancialAnalysis(String question, Integer companyId) {
        // Fetch financial data from the last 90 days
        LocalDate ninetyDaysAgo = LocalDate.now().minusDays(90);
        List<Expense> expenses = expenseRepository.findAllByCompanyIdAndExpenseDateAfter(companyId, ninetyDaysAgo);
        List<Income> incomes = incomeRepository.findAllByCompanyIdAndIncomeDateAfter(companyId, ninetyDaysAgo);

        // Format the data into a simple string for the AI prompt
        String expenseData = expenses.stream()
                .map(e -> String.format("%s (%s): $%.2f", e.getExpenseDate(), e.getCategory(), e.getAmount()))
                .collect(Collectors.joining(", "));

        String incomeData = incomes.stream()
                .map(i -> String.format("%s: $%.2f", i.getIncomeDate(), i.getAmount()))
                .collect(Collectors.joining(", "));
        logger.info(expenseData + incomeData);
        // Construct the detailed prompt
        String prompt = String.format(
                "As a business analyst for a logistics company, answer the following question based on the provided financial data from the last 90 days. " +
                        "Provide a concise, insightful answer. Question: '%s'. " +
                        "Here is the data: " +
                        "INCOMES: [%s]. " +
                        "EXPENSES: [%s].",
                question,
                incomeData.isEmpty() ? "None" : incomeData,
                expenseData.isEmpty() ? "None" : expenseData
        );

        return callAIService(prompt);
    }

    private Mono<String> callAIService(String prompt) {
        String fullUrl = aiServiceBaseUrl + "/{prompt}";
        logger.info("Sending AI prompt..." + fullUrl);

        return this.webClient.get()
                .uri(fullUrl, prompt)
                .retrieve()
                .bodyToMono(String.class)
                .doOnSuccess(response -> logger.info("Successfully received AI response." + response))
                .doOnError(error -> logger.error("Error calling AI service: ", error));
    }
}