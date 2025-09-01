package com.opsgrid.backend.repository;

import com.opsgrid.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    Optional<Object> findByInvitationToken(String token);

    Optional<User> findByUsername(String username); // Add this method
    // We can add custom query methods here later,
    // e.g., findByInvitationToken(String token);
}