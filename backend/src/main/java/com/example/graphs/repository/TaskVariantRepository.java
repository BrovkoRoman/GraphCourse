package com.example.graphs.repository;

import com.example.graphs.controller.dto.TaskVariantDto;
import com.example.graphs.repository.entity.TaskVariantEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskVariantRepository extends JpaRepository<TaskVariantEntity, Long> {
    @Query
    List<TaskVariantEntity> findAllByTaskId(Long taskId);
    @Query(value = """
                   SELECT COALESCE(MAX(VARIANT_INDEX), -1) + 1 FROM TASK_VARIANTS
                   WHERE TASK_ID = :taskId
                   """, nativeQuery = true)
    Long countVariants(Long taskId);
    @Query(value = """
                   SELECT TEXT FROM TASK_VARIANTS
                   WHERE TASK_ID = :taskId AND VARIANT_INDEX = :variantIndex
                   """, nativeQuery = true)
    String getTextByVariantIndex(Long taskId, Long variantIndex);
}
