package com.example.graphs.controller.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SubmissionFileResponseDto {
    private Long id;
    private Long submissionId;
    private Long taskId;
    private Long studentId;
    private String fileName;
}