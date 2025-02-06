package com.example.graphs.repository.entity;

import com.example.graphs.controller.dto.SubmissionFileDto;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "submission_files")
public class SubmissionFileEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private Long submissionId;
    private Long taskId;
    private Long studentId;
    private String fileName;
    private String mimeType;
    @Basic
    @Column(nullable = false, columnDefinition="BYTEA")
    private byte[] fileContent;

    public SubmissionFileEntity(SubmissionFileDto dto, Long studentId) {
        taskId = dto.getTaskId();
        fileName = dto.getFileName();
        mimeType = dto.getMimeType();
        fileContent = dto.getFileContent();
        submissionId = dto.getSubmissionId();
        this.studentId = studentId;
    }

    public SubmissionFileEntity() {}
}
