package com.example.graphs.repository.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "student_task_variants")
public class StudentTaskVariantEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private Long studentId;
    private Long taskId;
    private Long variantIndex;
    public StudentTaskVariantEntity(Long studentId, Long taskId, Long variantIndex) {
        this.studentId = studentId;
        this.taskId = taskId;
        this.variantIndex = variantIndex;
    }
}
