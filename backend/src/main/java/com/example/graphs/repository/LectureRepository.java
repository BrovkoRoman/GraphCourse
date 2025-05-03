package com.example.graphs.repository;

import com.example.graphs.controller.dto.FileContentDto;
import com.example.graphs.controller.dto.LectureDto;
import com.example.graphs.controller.dto.PossibleAnswerDto;
import com.example.graphs.repository.entity.LectureEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LectureRepository extends JpaRepository <LectureEntity, Long> {
    @Query(value = """
                   SELECT ID, SECTION_ID, FILE_NAME FROM LECTURES
                   """, nativeQuery = true)
    List<LectureDto> getLecturesWithoutContent();

    @Query(value = """
                   SELECT MIME_TYPE, FILE_CONTENT FROM LECTURES WHERE ID = :id
                   """, nativeQuery = true)
    Optional<FileContentDto> getLectureContent(Long id);
}
