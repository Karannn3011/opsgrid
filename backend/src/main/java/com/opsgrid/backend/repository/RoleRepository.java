package com.opsgrid.backend.repository;

import com.opsgrid.backend.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, Integer> {
}