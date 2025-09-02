package com.opsgrid.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "companies")
@Data
@NoArgsConstructor
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(length = 100, unique = true, nullable = false)
    private String name;

    // We can add more company-specific fields here later,
    // e.g., address, contact_person, subscription_status, etc.

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;
}