package com.opsgrid.backend.repository;

import com.opsgrid.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);

    // CORRECTED LINE: Changed Optional<Object> to Optional<User>
    Optional<User> findByInvitationToken(String token);

    Optional<User> findByUsername(String username);

    Optional<User> findFirstByRole_Name(String roleManager);
}