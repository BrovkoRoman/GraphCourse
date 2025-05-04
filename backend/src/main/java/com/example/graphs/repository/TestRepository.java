package com.example.graphs.repository;

import com.example.graphs.repository.entity.TestEntity;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TestRepository extends JpaRepository<TestEntity, Long> {
    @Query(value = """
                   SELECT max_score
                   FROM tests
                   WHERE id = :testId
                   """, nativeQuery = true)
    Optional<Integer> getMaxScore(Long testId);
    @Query
    boolean existsByIdAndPublishedTrue(Long id);
    @Query
    List<TestEntity> findAllByPublishedTrue();
    @Modifying
    @Transactional
    @Query(value = "update tests set published = true where id = :testId", nativeQuery = true)
    void publishTest(Long testId);

    @Query(value = """
                    SELECT COALESCE(SUM(MAX_SCORE), 0) FROM TESTS
                    """, nativeQuery = true)
    double getTotalScore();
}

