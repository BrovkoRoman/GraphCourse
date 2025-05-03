package com.example.graphs.repository;

import com.example.graphs.controller.dto.FileContentDto;
import com.example.graphs.controller.dto.SubmissionFileResponseDto;
import com.example.graphs.repository.entity.SubmissionFileEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubmissionFileRepository extends JpaRepository<SubmissionFileEntity, Long> {
    @Query(value = """
                SELECT ID, SUBMISSION_ID, TASK_ID, STUDENT_ID, FILE_NAME
                FROM SUBMISSION_FILES WHERE STUDENT_ID = :student_id
                AND TASK_ID = :task_id
            """, nativeQuery = true)
    List<SubmissionFileResponseDto> getUserTaskSubmissionFilesWithoutFileContent(@Param("student_id")
                                                                        Long studentId, @Param("task_id") Long taskId);


    @Query(value = """
                SELECT ID, SUBMISSION_ID, TASK_ID, STUDENT_ID, FILE_NAME
                FROM SUBMISSION_FILES WHERE TASK_ID = :task_id
            """, nativeQuery = true)
    List<SubmissionFileResponseDto> getTaskSubmissionFilesWithoutFileContent(@Param("task_id") Long taskId);

    @Query(value = """
                SELECT STUDENT_ID
                FROM SUBMISSION_FILES WHERE ID = :id
            """, nativeQuery = true)
    Optional<Long> getStudentByFileId(Long id);

    @Query(value = """
                   SELECT MIME_TYPE, FILE_CONTENT FROM SUBMISSION_FILES WHERE ID = :id
                   """, nativeQuery = true)
    Optional<FileContentDto> getFileContent(Long id);
}
