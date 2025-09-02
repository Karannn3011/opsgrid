package com.opsgrid.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(length = 50, unique = true, nullable = false)
    private String username;

    @Column(length = 100) // Now nullable, as it will be set by the user later
    private String password;

    @Column(length = 50, unique = true, nullable = false)
    private String employeeId;

    @Column(length = 100, unique = true, nullable = false)
    private String email;

    @Enumerated(EnumType.STRING) // Store the enum as a string ('PENDING', 'ACTIVE')
    @Column(length = 20, nullable = false)
    private UserStatus status;

    @Column(unique = true)
    private String invitationToken;

    private Instant invitationTokenExpiry;

    @ManyToOne
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    // NEW FIELD: Link to the Company
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;
}