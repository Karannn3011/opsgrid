package com.opsgrid.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "trucks") 
@Data
@NoArgsConstructor
public class Truck {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    
    private Integer id;

    @Column(length = 20, unique = true, nullable = false)
    
    private String licensePlate;

    @Column(length = 50)
    
    private String make;

    @Column(length = 50)
    
    private String model;

    
    private Integer year;

    
    private Integer capacityKg;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    
    private TruckStatus status;

    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    
    private Instant createdAt;
}