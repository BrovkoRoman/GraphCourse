package com.example.graphs.controller.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class PossibleAnswerDto {
    private Long id;
    private Long questionId;
    private String text;
}
