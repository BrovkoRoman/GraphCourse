package com.example.graphs.controller.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SubmissionResponseDto {
    private Long id;
    private boolean checked;
    private int score;
    private int tryId;
    private String login;

    public SubmissionResponseDto(Long id, boolean checked, int score, int tryId) {
        this.id = id;
        this.checked = checked;
        this.score = score;
        this.tryId = tryId;
    }
}
