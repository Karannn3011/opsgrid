package com.opsgrid.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "roles") // Maps this entity to the 'roles' table
@Data
@NoArgsConstructor
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    // Corresponds to 'id SERIAL PRIMARY KEY' [cite: 169]
    private Integer id;

    @Column(length = 20, unique = true, nullable = false)
    // Corresponds to 'name VARCHAR(20) UNIQUE NOT NULL' [cite: 170]
    private String name;
}