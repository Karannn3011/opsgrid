package com.opsgrid.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "issues")
@Data
@NoArgsConstructor
public class Issue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(length = 255, nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private IssueStatus status;

    @Enumerated(EnumType.STRING)
    @Column(length = 10, nullable = false)
    private IssuePriority priority;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reported_by_driver_id")
    private Driver reportedByDriver;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_to_manager_id")
    private User assignedToManager;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "related_truck_id")
    private Truck relatedTruck;

    // NEW FIELD: Link to the Company
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;
}