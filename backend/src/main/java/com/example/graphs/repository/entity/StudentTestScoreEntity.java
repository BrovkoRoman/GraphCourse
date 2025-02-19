package com.example.graphs.repository.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "student_test_scores")
public class StudentTestScoreEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private Long studentId;
    private Long testId;
    private double score;

    public StudentTestScoreEntity(Long studentId, Long testId, double score) {
        this.studentId = studentId;
        this.testId = testId;
        this.score = score;
    }
}
