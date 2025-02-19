package com.example.graphs.repository.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "student_test_answers")
public class StudentTestAnswerEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private Long studentId;
    private Long questionId;
    private String answer; // this is string for text-answer questions and id of possible answer for single-answer
                                                                                // and multiple-answer questions
}
