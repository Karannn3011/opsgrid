package com.opsgrid.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "drivers") // Maps to the 'drivers' table
@Data
@NoArgsConstructor
public class Driver {

    @Id
    @Column(name = "user_id")
    // Corresponds to 'user_id UUID PRIMARY KEY'
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId // This tells JPA that the 'id' field is mapped from the User entity
    @JoinColumn(name = "user_id")
    // Corresponds to 'REFERENCES users(id)'
    private User user;

    @Column(length = 100, nullable = false)
    // Corresponds to 'full_name VARCHAR(100) NOT NULL'
    private String fullName;

    @Column(length = 50, unique = true, nullable = false)
    // Corresponds to 'license_number VARCHAR(50) UNIQUE NOT NULL'
    private String licenseNumber;

    @Column(length = 20)
    // Corresponds to 'contact_number VARCHAR(20)'
    private String contactNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_truck_id", referencedColumnName = "id")
    // Corresponds to 'assigned_truck_id INT REFERENCES trucks(id)'
    private Truck assignedTruck;

    // NEW FIELD: Link to the Company
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;
}