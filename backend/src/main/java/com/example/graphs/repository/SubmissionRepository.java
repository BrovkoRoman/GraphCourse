package com.example.graphs.repository;

import com.example.graphs.controller.dto.SubmissionResponseDto;
import com.example.graphs.controller.dto.TaskScoreDto;
import com.example.graphs.repository.entity.SubmissionEntity;
import com.example.graphs.service.model.StudentTaskScore;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubmissionRepository extends JpaRepository<SubmissionEntity, Long> {
    @Query(value = "SELECT id, checked, score, try_id FROM TASK_SUBMISSIONS WHERE STUDENT_ID = :student_id" +
            " AND TASK_ID = :task_id", nativeQuery = true)
    List<SubmissionResponseDto> getUserTaskSubmissions(@Param("student_id") Long studentId, @Param("task_id") Long taskId);

    @Query(value = """
                    SELECT s.id, s.checked, s.score, s.try_id, u.login
                    FROM TASK_SUBMISSIONS AS s INNER JOIN USERS AS u
                    ON s.student_id = u.id
                    WHERE TASK_ID = :task_id
                    """, nativeQuery = true)
    List<SubmissionResponseDto> getByTaskId(@Param("task_id") Long taskId);

    @Modifying
    @Transactional
    @Query(value = "update task_submissions set checked = true, score = :score where id = :id", nativeQuery = true)
    void setScore(@Param("id") Long id, @Param("score") int score);

    @Query(value = """
                   SELECT task_id, MAX(score) FROM TASK_SUBMISSIONS
                   WHERE student_id = :student_id AND checked
                   GROUP BY task_id
                   """,
            nativeQuery = true)
    List<TaskScoreDto> getTaskScores(@Param("student_id") Long studentId);
    @Query(value = """
                   SELECT LOGIN, task_id, max(score) AS score
                   FROM TASK_SUBMISSIONS LEFT JOIN USERS
                   ON TASK_SUBMISSIONS.STUDENT_ID = USERS.ID
                   WHERE checked AND USERS.ROLE = 'STUDENT'
                   GROUP BY LOGIN, task_id
                   """, nativeQuery = true)
    List<StudentTaskScore> getTaskScoresOfAllStudents();
}
