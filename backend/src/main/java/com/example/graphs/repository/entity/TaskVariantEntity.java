package com.example.graphs.repository.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "task_variants")
public class TaskVariantEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long taskId;
    @Column(unique = true)
    private Long variantIndex; // starting from 0
    @Column(columnDefinition = "text")
    private String text;
}
