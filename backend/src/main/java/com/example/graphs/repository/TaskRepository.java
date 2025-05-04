package com.example.graphs.repository;

import com.example.graphs.repository.entity.TaskEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskRepository extends JpaRepository<TaskEntity, Long> {
    @Query(value = """
                    SELECT COALESCE(SUM(MAX_SCORE), 0) FROM TASKS
                    """, nativeQuery = true)
    double getTotalScore();
}
