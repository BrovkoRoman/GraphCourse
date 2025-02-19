package com.example.graphs.repository;

import com.example.graphs.controller.dto.StudentTestAnswerResponseDto;
import com.example.graphs.repository.entity.StudentTestAnswerEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentTestAnswerRepository extends JpaRepository<StudentTestAnswerEntity, Long> {
    @Query(value = """
                   SELECT A.question_id, A.answer
                   FROM STUDENT_TEST_ANSWERS AS A LEFT JOIN TEST_QUESTIONS AS Q ON A.question_id = Q.id
                   WHERE Q.test_id = :testId AND A.student_id = :studentId
                   """, nativeQuery = true)
    List<StudentTestAnswerResponseDto> getAllByStudentIdAndTestId(Long studentId, Long testId);
}