package com.opsgrid.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "trucks") // Maps to the 'trucks' table
@Data
@NoArgsConstructor
public class Truck {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    // Corresponds to 'id SERIAL PRIMARY KEY' [cite: 183]
    private Integer id;

    @Column(length = 20, unique = true, nullable = false)
    // Corresponds to 'license_plate VARCHAR(20) UNIQUE NOT NULL' [cite: 184]
    private String licensePlate;

    @Column(length = 50)
    // Corresponds to 'make VARCHAR(50)' [cite: 185]
    private String make;

    @Column(length = 50)
    // Corresponds to 'model VARCHAR(50)' [cite: 186]
    private String model;

    // Corresponds to 'year INT' [cite: 187]
    private Integer year;

    // Corresponds to 'capacity_kg INT' [cite: 188]
    private Integer capacityKg;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    // Corresponds to 'status VARCHAR(20) NOT NULL'
    private TruckStatus status;

    // NEW FIELD: Link to the Company
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    // Corresponds to 'created_at TIMESTAMPTZ DEFAULT now()' [cite: 190]
    private Instant createdAt;
}