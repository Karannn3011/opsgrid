package com.opsgrid.backend.service;

import com.opsgrid.backend.dto.CreateExpenseRequest;
import com.opsgrid.backend.dto.CreateMaintenanceLogRequest;
import com.opsgrid.backend.dto.ExpenseDTO;
import com.opsgrid.backend.dto.IncomeDTO;
import com.opsgrid.backend.entity.*;
import com.opsgrid.backend.repository.CompanyRepository;
import com.opsgrid.backend.repository.ExpenseRepository;
import com.opsgrid.backend.repository.IncomeRepository;
import com.opsgrid.backend.repository.ShipmentRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FinanceServiceImpl implements FinanceService {

    private final ExpenseRepository expenseRepository;
    private final IncomeRepository incomeRepository;
    private final CompanyRepository companyRepository;
    private final ShipmentRepository shipmentRepository;
    private final MaintenanceLogService maintenanceLogService;

    @Override
    public Page<ExpenseDTO> getExpenses(Integer companyId, Pageable pageable) {
        // This is a placeholder for a more complex query if needed
        return expenseRepository.findAll(pageable).map(this::convertToDto);
    }

    @Override
    @Transactional // Ensure both operations succeed or fail together
    public ExpenseDTO createExpense(CreateExpenseRequest expenseRequest, Integer companyId) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        Expense expense = new Expense();
        expense.setDescription(expenseRequest.description());
        expense.setAmount(expenseRequest.amount());
        expense.setCategory(expenseRequest.category());
        expense.setExpenseDate(expenseRequest.expenseDate());
        expense.setCompany(company);

        Expense savedExpense = expenseRepository.save(expense);

        // Smartly create a maintenance log if the category is MAINTENANCE
        if (expenseRequest.category() == ExpenseCategory.MAINTENANCE && expenseRequest.truckId() != null) {
            CreateMaintenanceLogRequest logRequest = new CreateMaintenanceLogRequest(
                    expenseRequest.truckId(),
                    expenseRequest.description(),
                    expenseRequest.amount(),
                    expenseRequest.expenseDate()
            );
            maintenanceLogService.createLog(companyId, logRequest);
        }

        return convertToDto(savedExpense);
    }

    @Override
    public void deleteExpense(Integer expenseId, Integer companyId) {
        Expense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new RuntimeException("Expense not found"));
        if (!expense.getCompany().getId().equals(companyId)) {
            throw new RuntimeException("Expense does not belong to this company");
        }
        expenseRepository.delete(expense);
    }

    @Override
    public Page<IncomeDTO> getIncomes(Integer companyId, Pageable pageable) {
        // This is a placeholder for a more complex query if needed
        return incomeRepository.findAll(pageable).map(this::convertToDto);
    }

    @Override
    public IncomeDTO createIncome(IncomeDTO incomeDTO, Integer companyId) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        Income income = new Income();
        income.setDescription(incomeDTO.description());
        income.setAmount(incomeDTO.amount());
        income.setIncomeDate(incomeDTO.incomeDate());
        income.setCompany(company);

        if (incomeDTO.shipmentId() != null) {
            Shipment shipment = shipmentRepository.findByIdAndCompanyId(incomeDTO.shipmentId(), companyId)
                    .orElseThrow(() -> new RuntimeException("Shipment not found"));
            income.setShipment(shipment);
        }

        Income savedIncome = incomeRepository.save(income);
        return convertToDto(savedIncome);
    }

    @Override
    public void deleteIncome(Integer incomeId, Integer companyId) {
        Income income = incomeRepository.findById(incomeId)
                .orElseThrow(() -> new RuntimeException("Income not found"));
        if (!income.getCompany().getId().equals(companyId)) {
            throw new RuntimeException("Income does not belong to this company");
        }
        incomeRepository.delete(income);
    }

    private ExpenseDTO convertToDto(Expense expense) {
        return new ExpenseDTO(
                expense.getId(),
                expense.getDescription(),
                expense.getAmount(),
                expense.getCategory(),
                expense.getExpenseDate(),
                expense.getCreatedAt(),
                expense.getCompany().getId()
        );
    }

    private IncomeDTO convertToDto(Income income) {
        return new IncomeDTO(
                income.getId(),
                income.getDescription(),
                income.getAmount(),
                income.getIncomeDate(),
                income.getShipment() != null ? income.getShipment().getId() : null,
                income.getCreatedAt(),
                income.getCompany().getId()
        );
    }
}