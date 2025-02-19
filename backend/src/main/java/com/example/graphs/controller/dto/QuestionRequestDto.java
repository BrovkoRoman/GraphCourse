package com.example.graphs.controller.dto;

import com.example.graphs.repository.entity.PossibleAnswerToQuestionEntity;
import com.example.graphs.repository.entity.TestQuestionEntity;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class QuestionRequestDto {
    private TestQuestionEntity questionEntity;
    private List<PossibleAnswerToQuestionEntity> possibleAnswers;
}
