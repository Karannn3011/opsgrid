package com.opsgrid.backend.service;

import com.opsgrid.backend.dto.*;
import com.opsgrid.backend.entity.*;
import com.opsgrid.backend.repository.CompanyRepository;
import com.opsgrid.backend.repository.ExpenseRepository;
import com.opsgrid.backend.repository.IncomeRepository;
import com.opsgrid.backend.repository.ShipmentRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

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
        
        return expenseRepository.findAll(pageable).map(this::convertToDto);
    }

    @Override
    @Transactional 
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

    @Override
    public Page<FinanceRecordDTO> getAllFinanceRecords(Integer companyId, Pageable pageable) {
        List<Expense> expenses = expenseRepository.findAllByCompanyId(companyId);
        List<Income> incomes = incomeRepository.findAllByCompanyId(companyId);

        List<FinanceRecordDTO> allRecords = new ArrayList<>();

        expenses.forEach(e -> allRecords.add(new FinanceRecordDTO(
                e.getId(),
                TransactionType.EXPENSE,
                e.getDescription(),
                e.getAmount(),
                e.getExpenseDate(),
                e.getCategory()
        )));

        incomes.forEach(i -> allRecords.add(new FinanceRecordDTO(
                i.getId(),
                TransactionType.INCOME,
                i.getDescription(),
                i.getAmount(),
                i.getIncomeDate(),
                null
        )));

        
        allRecords.sort(Comparator.comparing(FinanceRecordDTO::date).reversed());

        
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), allRecords.size());

        List<FinanceRecordDTO> pageContent = allRecords.subList(start, end);

        return new PageImpl<>(pageContent, pageable, allRecords.size());
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