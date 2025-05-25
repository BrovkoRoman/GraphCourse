package com.example.graphs.repository.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "task_submissions")
public class SubmissionEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private int tryId;
    private Long taskId;
    private Long studentId;
    private Long variantIndex;
    private boolean checked;
    private int score;

    public SubmissionEntity(Long taskId, Long studentId, Long variantIndex, int tryId) {
        this.tryId = tryId;
        this.taskId = taskId;
        this.variantIndex = variantIndex;
        this.studentId = studentId;
        checked = false;
        score = 0;
    }

    public SubmissionEntity() {}
}
