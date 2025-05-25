package com.example.graphs.controller.dto;

import lombok.Getter;

@Getter
public class SubmissionRequestDto {
    private Long taskId;
    private Long variantIndex;
    private int tryId;
}
