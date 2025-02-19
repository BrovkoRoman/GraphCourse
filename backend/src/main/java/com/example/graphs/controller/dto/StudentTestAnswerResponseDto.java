package com.example.graphs.controller.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class StudentTestAnswerResponseDto {
    private Long questionId;
    private String answer; // this is string for text-answer questions and id of possible answer for single-answer
                                                                                    // and multiple-answer questions
}
