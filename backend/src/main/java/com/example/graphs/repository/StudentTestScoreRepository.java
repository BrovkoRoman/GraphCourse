package com.example.graphs.repository;

import com.example.graphs.controller.dto.StudentScoreDto;
import com.example.graphs.controller.dto.StudentTestScoresDto;
import com.example.graphs.repository.entity.StudentTestScoreEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentTestScoreRepository extends JpaRepository<StudentTestScoreEntity, Long> {
    @Query
    boolean existsByStudentIdAndTestId(Long studentId, Long testId);
    @Query(value = """
                   SELECT score
                   FROM STUDENT_TEST_SCORES
                   WHERE student_id = :studentId AND test_id = :testId
                   """, nativeQuery = true)
    Optional<Double> getScoreByStudentIdAndTestId(Long studentId, Long testId);
    @Query(value = """
                   SELECT test_id, score
                   FROM STUDENT_TEST_SCORES
                   WHERE student_id = :studentId
                   """, nativeQuery = true)
    List<StudentTestScoresDto> getStudentScores(Long studentId);
    @Query(value = """
                   SELECT LOGIN, sum(score)
                   FROM STUDENT_TEST_SCORES LEFT JOIN USERS
                   ON STUDENT_TEST_SCORES.STUDENT_ID = USERS.ID
                   WHERE USERS.ROLE = 'STUDENT'
                   GROUP BY LOGIN
                   """, nativeQuery = true)
    List<StudentScoreDto> getTotalScoresOfAllStudents();
}
