package com.example.graphs.repository;

import com.example.graphs.controller.dto.FileContentDto;
import com.example.graphs.controller.dto.FileDto;
import com.example.graphs.repository.entity.FileEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FileRepository extends JpaRepository <FileEntity, Long> {
    @Query(value = """
                   SELECT ID, SECTION_ID, FILE_NAME FROM FILES
                   """, nativeQuery = true)
    List<FileDto> getFilesWithoutContent();

    @Query(value = """
                   SELECT MIME_TYPE, FILE_CONTENT FROM FILES WHERE ID = :id
                   """, nativeQuery = true)
    Optional<FileContentDto> getFileContent(Long id);
}
