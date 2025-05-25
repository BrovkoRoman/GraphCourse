package com.example.graphs.repository;

import com.example.graphs.repository.entity.StudentTaskVariantEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentTaskVariantRepository extends JpaRepository<StudentTaskVariantEntity, Long> {
    @Query(value = """
                   SELECT VARIANT_INDEX FROM STUDENT_TASK_VARIANTS
                   WHERE STUDENT_ID = :studentId AND TASK_ID = :taskId
                   """, nativeQuery = true)
    Optional<Long> getStudentTaskVariant(Long studentId, Long taskId);
}
