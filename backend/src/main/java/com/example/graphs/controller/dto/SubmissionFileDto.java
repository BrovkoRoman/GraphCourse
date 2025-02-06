package com.example.graphs.controller.dto;
import com.example.graphs.repository.SubmissionFileRepository;
import jakarta.persistence.Basic;
import jakarta.persistence.Column;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;

@Getter
public class SubmissionFileDto {
    private Long submissionId;
    private Long taskId;
    private String fileName;
    private String mimeType;
    private byte[] fileContent;
}
