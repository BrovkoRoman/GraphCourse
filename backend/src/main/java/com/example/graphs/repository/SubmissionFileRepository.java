package com.example.graphs.repository;

import com.example.graphs.repository.entity.SubmissionFileEntity;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubmissionFileRepository extends JpaRepository<SubmissionFileEntity, Long> {
    @Query(value = "SELECT * FROM SUBMISSION_FILES WHERE STUDENT_ID = :student_id" +
            " AND TASK_ID = :task_id", nativeQuery = true)
    List<SubmissionFileEntity> getUserTaskSubmissions(@Param("student_id") Long studentId, @Param("task_id") Long taskId);

    @Query
    List<SubmissionFileEntity> findAllByTaskId(Long taskId);
}
