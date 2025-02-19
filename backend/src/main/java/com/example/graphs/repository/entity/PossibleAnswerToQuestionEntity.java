package com.example.graphs.repository.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "possible_answers")
public class PossibleAnswerToQuestionEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private Long questionId;
    private String text;
    private boolean correct;
}
