package com.example.graphs.repository;

import com.example.graphs.repository.entity.PossibleAnswerToQuestionEntity;
import com.example.graphs.repository.entity.TestQuestionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TestQuestionRepository extends JpaRepository<TestQuestionEntity, Long> {
    @Query
    List<TestQuestionEntity> findAllByTestId(Long testId);
}