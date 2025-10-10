package com.opsgrid.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "drivers") 
@Data
@NoArgsConstructor
public class Driver {

    @Id
    @Column(name = "user_id")
    
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId 
    @JoinColumn(name = "user_id")
    
    private User user;

    @Column(length = 100, nullable = false)
    
    private String fullName;

    @Column(length = 50, unique = true, nullable = false)
    
    private String licenseNumber;

    @Column(length = 20)
    
    private String contactNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_truck_id", referencedColumnName = "id")
    
    private Truck assignedTruck;

    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;
}