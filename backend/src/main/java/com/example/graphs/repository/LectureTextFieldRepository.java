package com.example.graphs.repository;

import com.example.graphs.repository.entity.LectureEntity;
import com.example.graphs.repository.entity.LectureTextFieldEntity;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LectureTextFieldRepository extends JpaRepository<LectureTextFieldEntity, Long> {
    @Query(value = """
                   SELECT * FROM LECTURE_TEXT_FIELDS WHERE LECTURE_ID = :id
                   """, nativeQuery = true)
    List<LectureTextFieldEntity> getTextFieldsOfLecture(Long id);
    @Modifying
    @Transactional
    @Query(value = "update lecture_text_fields set content = :content where id = :id", nativeQuery = true)
    void updateField(@Param("id") Long id, @Param("content") String content);
    @Modifying
    @Transactional
    @Query(value = """
                   update lecture_text_fields set field_index = field_index + 1
                   where lecture_id = :lectureId
                   and field_index >= :insertingFieldIndex
                   """, nativeQuery = true)
    void shiftFieldsForInsertion(@Param("lectureId") Long lectureId,
                                 @Param("insertingFieldIndex") Long insertingFieldIndex);
}
