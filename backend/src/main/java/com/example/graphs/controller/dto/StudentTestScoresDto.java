package com.example.graphs.controller.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class StudentTestScoresDto {
    private Long testId;
    private double score;
}
