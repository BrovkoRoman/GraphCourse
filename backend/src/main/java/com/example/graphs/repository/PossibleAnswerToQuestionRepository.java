package com.example.graphs.repository;

import com.example.graphs.controller.dto.PossibleAnswerDto;
import com.example.graphs.repository.entity.PossibleAnswerToQuestionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PossibleAnswerToQuestionRepository extends JpaRepository<PossibleAnswerToQuestionEntity, Long> {
    @Query(value = """
                   SELECT A.id, A.question_id, A.text
                   FROM POSSIBLE_ANSWERS AS A LEFT JOIN TEST_QUESTIONS AS Q ON A.question_id = Q.id
                   WHERE Q.test_id = :testId AND Q.type != 1
                   """, nativeQuery = true) // for questions with text answer (type=1) it doesn't find correct answer
    List<PossibleAnswerDto> getAllWithoutCorrectnessByTestId(Long testId);

    @Query(value = """
                   SELECT A.id, A.question_id, A.text
                   FROM POSSIBLE_ANSWERS AS A LEFT JOIN TEST_QUESTIONS AS Q ON A.question_id = Q.id
                   WHERE Q.test_id = :testId AND A.correct
                   """, nativeQuery = true)
    List<PossibleAnswerDto> getAllCorrectByTestId(Long testId);

    @Query(value = """
                   SELECT A.id, A.question_id, A.text, A.correct
                   FROM POSSIBLE_ANSWERS AS A LEFT JOIN TEST_QUESTIONS AS Q ON A.question_id = Q.id
                   WHERE Q.test_id = :testId
                   """, nativeQuery = true)
    List<PossibleAnswerToQuestionEntity> getAllByTestId(Long testId);
}
