package com.example.graphs.repository;
import com.example.graphs.repository.entity.LectureEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LectureRepository extends JpaRepository<LectureEntity, Long> {
    @Query(value = """
                   SELECT ID, SECTION_ID, NAME FROM LECTURES
                   """, nativeQuery = true)
    List<LectureEntity> getLecturesWithoutContent();
}
