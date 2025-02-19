package com.example.graphs.repository.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "test_questions")
public class TestQuestionEntity {
    /*
        types of questions:
        1 - text answer
        2 - single answer
        3 - multiple answers
     */
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private Long testId;
    private int type;
    private String text;
}
