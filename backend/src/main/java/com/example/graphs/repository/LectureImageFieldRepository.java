package com.example.graphs.repository;

import com.example.graphs.repository.entity.LectureImageFieldEntity;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LectureImageFieldRepository extends JpaRepository<LectureImageFieldEntity, Long> {
    @Query(value = """
                   SELECT * FROM LECTURE_IMAGE_FIELDS WHERE LECTURE_ID = :id
                   """, nativeQuery = true)
    List<LectureImageFieldEntity> getImageFieldsOfLecture(Long id);
    @Modifying
    @Transactional
    @Query(value = """
                   update lecture_image_fields set field_index = field_index + 1
                   where lecture_id = :lectureId
                   and field_index >= :insertingFieldIndex
                   """, nativeQuery = true)
    void shiftFieldsForInsertion(@Param("lectureId") Long lectureId,
                                 @Param("insertingFieldIndex") Long insertingFieldIndex);
}
