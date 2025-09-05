package com.opsgrid.backend.repository;

import com.opsgrid.backend.entity.Income;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface IncomeRepository extends JpaRepository<Income, Integer> {
    List<Income> findAllByCompanyIdAndIncomeDateAfter(Integer companyId, LocalDate ninetyDaysAgo);
}