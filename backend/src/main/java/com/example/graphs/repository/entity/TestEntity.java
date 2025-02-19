package com.example.graphs.repository.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "tests")
public class TestEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private Long sectionId;
    private String name;
    private boolean published;
    private int maxScore;
}
