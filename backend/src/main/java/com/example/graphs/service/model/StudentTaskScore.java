package com.example.graphs.service.model;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class StudentTaskScore {
    private String login;
    private Long taskId;
    private double score;
}
