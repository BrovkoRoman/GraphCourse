package com.example.graphs.controller.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class StudentTestResponseDto {
    private double score;
    private List<StudentTestAnswerResponseDto> answers;
}
