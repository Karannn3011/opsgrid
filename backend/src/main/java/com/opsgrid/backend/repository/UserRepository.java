package com.opsgrid.backend.repository;

import com.opsgrid.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query; // Import Query
import org.springframework.data.repository.query.Param; // Import Param
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List; // Import List
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    // CORRECTED LINE: Changed Optional<Object> to Optional<User>
    Optional<User> findByInvitationToken(String token);

    Optional<User> findByUsername(String username);

    Optional<User> findFirstByRole_Name(String roleManager);

    Optional<User> findByIdAndCompanyId(UUID managerId, Integer companyId);

    Optional<User> findFirstByCompanyIdAndRole_Name(Integer companyId, String roleManager);

    boolean existsByUsernameAndCompanyId(String username, Integer companyId);

    boolean existsByEmailAndCompanyId(String email, Integer companyId);

    @Query("SELECT u FROM User u WHERE u.company.id = :companyId AND u.role.name = 'ROLE_DRIVER' AND u.id NOT IN (SELECT d.id FROM Driver d WHERE d.company.id = :companyId)")
    List<User> findUsersWithRoleDriverAndNoDriverProfile(@Param("companyId") Integer companyId);

    Page<User> findAllByCompanyId(Integer companyId, Pageable pageable);
}