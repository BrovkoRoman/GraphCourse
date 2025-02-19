package com.example.graphs.controller.dto;

import com.example.graphs.repository.entity.StudentTestAnswerEntity;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class TestSubmissionDto {
    private Long testId;
    private List<StudentTestAnswerEntity> answers; // frontend will send questionId and answer,
                                                    // studentId can be set on the backend
}