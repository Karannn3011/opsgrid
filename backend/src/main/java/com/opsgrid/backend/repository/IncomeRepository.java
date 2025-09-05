package com.opsgrid.backend.repository;

import com.opsgrid.backend.entity.Income;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IncomeRepository extends JpaRepository<Income, Integer> {
}